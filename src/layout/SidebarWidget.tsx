import { useState, useEffect } from 'react';


export default function SidebarWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fraseMotivacional, setFraseMotivacional] = useState('');

  // Frases motivacionales para cobradores
  const frases = [
    "No nos llames, mañana te llamamos",
    "Cada crédito es una oportunidad",
    "La confianza es la base del préstamo",
    "Crecemos juntos, cliente a cliente",
    "Persistencia gota a gota",
    "Cobranza efectiva, resultados reales",
    "Tu éxito es nuestro éxito",
    "Calidad en cada gestión de cobro",
    "Ciclo virtuoso: prestar, cobrar, crecer",
    "Meta: cero cartera vencida"
  ];

  useEffect(() => {
    // Actualizar hora cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Seleccionar frase aleatoria
    setFraseMotivacional(frases[Math.floor(Math.random() * frases.length)]);

    return () => clearInterval(timer);
  }, []);




  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mx-auto mb-6 w-full max-w-60 space-y-4">
      {/* Tarjeta de bienvenida con hora */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-5 text-center shadow-lg dark:from-blue-900 dark:to-blue-950">
        <h3 className="mb-1 text-lg font-bold text-white">
          💧 UniCobranzas 💧
        </h3>
        <p className="text-sm text-blue-100">
          Sistema de Cobranza
        </p>
        <div className="mt-3 border-t border-blue-400/30 pt-3">
          <p className="text-2xl font-bold text-white">
            {formatTime(currentTime)}
          </p>
          <p className="mt-1 text-xs text-blue-200 capitalize">
            {formatDate(currentTime)}
          </p>
        </div>
      </div>

      {/* Frase motivacional */}
      <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center dark:bg-amber-900/20">
        <p className="text-sm italic text-amber-800 dark:text-amber-200">
          "{fraseMotivacional}"
        </p>
      </div>

      {/* Versión del sistema */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-100">
        <p>Gota a Gota v1.0.0</p>
        <p className="mt-1">© 2024 - Todos los derechos reservados</p>
      </div>
    </div>
  );
}