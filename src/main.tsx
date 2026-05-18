import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Capturador de erros para mostrar na tela do celular
window.onerror = function (message, source, lineno, colno, error) {
  const errorBox = document.createElement("div");
  errorBox.style.position = "fixed";
  errorBox.style.top = "0";
  errorBox.style.left = "0";
  errorBox.style.width = "100vw";
  errorBox.style.height = "100vh";
  errorBox.style.backgroundColor = "#1a1a1a";
  errorBox.style.color = "#ff4a4a";
  errorBox.style.padding = "20px";
  errorBox.style.fontFamily = "monospace";
  errorBox.style.zIndex = "99999";
  errorBox.style.overflowY = "auto";
  
  errorBox.innerHTML = `
    <h2 style="color: #ff4a4a; margin-bottom: 10px;">❌ Erro no Navegador:</h2>
    <p><strong>Mensagem:</strong> ${message}</p>
    <p><strong>Arquivo:</strong> ${source}</p>
    <p><strong>Linha/Coluna:</strong> ${lineno}:${colno}</p>
    <p style="margin-top: 15px; color: #aaa;"><strong>Stack:</strong> ${error ? error.stack : 'Não disponível'}</p>
  `;
  document.body.appendChild(errorBox);
  return false;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
