// ============================================================================
// PAYMENT PAGE - viitinhcortes
// Página de pagamento com PIX
// ============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Clock, QrCode as QrCodeIcon } from 'lucide-react';
import { generatePixPayment, checkPaymentStatus } from '../services/payment';
import type { PixPayment } from '../services/payment';
import toast from 'react-hot-toast';

export function PaymentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [pixData, setPixData] = useState<PixPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos

  useEffect(() => {
    if (appointmentId) {
      loadPixPayment();
    }
  }, [appointmentId]);

  // Timer de expiração
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Verificar status do pagamento automaticamente
  useEffect(() => {
    if (!pixData) return;

    const interval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(pixData.id);
        if (status === 'completed') {
          toast.success('Pagamento confirmado!');
          navigate(`/appointments/${appointmentId}`);
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      }
    }, 5000); // Verificar a cada 5 segundos

    return () => clearInterval(interval);
  }, [pixData, appointmentId, navigate]);

  const loadPixPayment = async () => {
    try {
      // Buscar valor do agendamento (mock - buscar do banco em produção)
      const amount = 80; // R$ 80,00
      
      const payment = await generatePixPayment(appointmentId!, amount);
      setPixData(payment);
    } catch (error) {
      toast.error('Erro ao gerar pagamento PIX');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.qrCodeText);
      toast.success('Código PIX copiado!');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Gerando pagamento PIX...</p>
        </div>
      </div>
    );
  }

  if (!pixData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400">Erro ao carregar pagamento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
            <QrCodeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pagamento via PIX</h1>
          <p className="text-gray-400">Escaneie o QR Code ou copie o código</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6 pb-6 border-b border-gray-800">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-gray-300">Tempo restante:</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Valor */}
          <div className="text-center mb-8">
            <p className="text-gray-400 mb-2">Valor a pagar</p>
            <p className="text-4xl font-bold text-white">
              R$ {pixData.amount.toFixed(2)}
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 mb-6 mx-auto w-fit">
            <img
              src={pixData.qrCode}
              alt="QR Code PIX"
              className="w-64 h-64"
            />
          </div>

          {/* Código PIX */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Código PIX (Copia e Cola)
            </label>
            <div className="relative">
              <input
                type="text"
                value={pixData.qrCodeText}
                readOnly
                className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm font-mono"
              />
              <button
                onClick={copyPixCode}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
            <h3 className="text-blue-400 font-semibold mb-3">Como pagar:</h3>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Abra o app do seu banco</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Escolha pagar com PIX</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Escaneie o QR Code ou cole o código acima</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Confirme o pagamento</span>
              </li>
            </ol>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-amber-400">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Aguardando pagamento...</span>
            </div>
          </div>
        </div>

        {/* Nota */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Após confirmar o pagamento, você receberá a confirmação automaticamente
        </p>
      </div>
    </div>
  );
}
