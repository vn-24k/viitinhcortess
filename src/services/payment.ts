// ============================================================================
// PAYMENT SERVICE - viitinhcortes
// Integração com PIX e Mercado Pago
// ============================================================================

import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';

export interface PixPayment {
  id: string;
  qrCode: string; // Base64 da imagem QR Code
  qrCodeText: string; // Texto "copia e cola"
  amount: number;
  expiresAt: Date;
}

// ============================================================================
// GERAR PAGAMENTO PIX (Mock - Integrar com Mercado Pago em produção)
// ============================================================================

export async function generatePixPayment(
  appointmentId: string,
  amount: number
): Promise<PixPayment> {
  
  // Mock PIX - Em produção, integrar com Mercado Pago
  const pixKey = 'suachavepix@email.com'; // Buscar das configurações
  const merchantName = 'VIITINHCORTES';
  const merchantCity = 'SAO PAULO';
  const txid = `APT${appointmentId.slice(0, 8)}`;
  
  // Gerar PIX Copia e Cola (EMV Format)
  const pixString = generatePixString(pixKey, merchantName, merchantCity, amount, txid);
  
  // Gerar QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(pixString, {
    width: 300,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  // Salvar no banco
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      appointment_id: appointmentId,
      amount,
      method: 'pix',
      status: 'pending',
      pix_qr_code: qrCodeDataUrl,
      pix_code: pixString,
      external_id: txid,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: payment.id,
    qrCode: qrCodeDataUrl,
    qrCodeText: pixString,
    amount,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
  };
}

// ============================================================================
// VERIFICAR STATUS DO PAGAMENTO
// ============================================================================

export async function checkPaymentStatus(paymentId: string): Promise<string> {
  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('id', paymentId)
    .single();

  if (error) throw error;
  return data.status;
}

// ============================================================================
// CONFIRMAR PAGAMENTO MANUALMENTE (Admin)
// ============================================================================

export async function confirmPayment(paymentId: string, appointmentId: string): Promise<void> {
  // Atualizar pagamento
  await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('id', paymentId);

  // Atualizar agendamento
  await supabase
    .from('appointments')
    .update({ 
      payment_status: 'paid',
      status: 'confirmed',
    })
    .eq('id', appointmentId);
}

// ============================================================================
// INTEGRAÇÃO COM MERCADO PAGO (Para produção)
// ============================================================================

export async function generateMercadoPagoPixPayment(
  appointmentId: string,
  amount: number,
  description: string
): Promise<PixPayment> {
  
  const mercadoPagoToken = import.meta.env.VITE_MERCADOPAGO_TOKEN;
  
  if (!mercadoPagoToken) {
    throw new Error('Token do Mercado Pago não configurado');
  }

  // Chamar API do Mercado Pago
  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mercadoPagoToken}`,
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description,
      payment_method_id: 'pix',
      payer: {
        email: 'cliente@email.com',
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao gerar pagamento PIX');
  }

  // Gerar QR Code do PIX
  const qrCodeDataUrl = await QRCode.toDataURL(data.point_of_interaction.transaction_data.qr_code, {
    width: 300,
    margin: 1,
  });

  // Salvar no banco
  await supabase
    .from('payments')
    .insert({
      appointment_id: appointmentId,
      amount,
      method: 'pix',
      status: 'pending',
      pix_qr_code: qrCodeDataUrl,
      pix_code: data.point_of_interaction.transaction_data.qr_code,
      external_id: data.id.toString(),
      metadata: data,
    });

  return {
    id: data.id,
    qrCode: qrCodeDataUrl,
    qrCodeText: data.point_of_interaction.transaction_data.qr_code,
    amount,
    expiresAt: new Date(data.date_of_expiration),
  };
}

// ============================================================================
// WEBHOOK MERCADO PAGO (Receber notificações de pagamento)
// ============================================================================

export async function handleMercadoPagoWebhook(paymentId: string) {
  const mercadoPagoToken = import.meta.env.VITE_MERCADOPAGO_TOKEN;

  // Buscar detalhes do pagamento
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${mercadoPagoToken}`,
    },
  });

  const payment = await response.json();

  if (payment.status === 'approved') {
    // Atualizar pagamento no banco
    const { data: localPayment } = await supabase
      .from('payments')
      .select('id, appointment_id')
      .eq('external_id', paymentId)
      .single();

    if (localPayment) {
      await confirmPayment(localPayment.id, localPayment.appointment_id);
    }
  }
}

// ============================================================================
// HELPER: Gerar String PIX (Formato EMV)
// ============================================================================

function generatePixString(
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  amount: number,
  txid: string
): string {
  // Simplified PIX EMV format
  const formatField = (id: string, value: string) => {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  };

  const payload = [
    formatField('00', '01'), // Payload Format Indicator
    formatField('26', formatField('00', 'BR.GOV.BCB.PIX') + formatField('01', pixKey)),
    formatField('52', '0000'), // Merchant Category Code
    formatField('53', '986'), // Transaction Currency (BRL)
    formatField('54', amount.toFixed(2)),
    formatField('58', 'BR'),
    formatField('59', merchantName),
    formatField('60', merchantCity),
    formatField('62', formatField('05', txid)),
  ].join('');

  // CRC16
  const crc = calculateCRC16(payload + '6304');
  return payload + '6304' + crc;
}

function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}
