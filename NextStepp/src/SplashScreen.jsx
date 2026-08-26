// src/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import './SplashScreen.css'; // Importaremos los estilos aquí

const SplashScreen = ({ onLoadingFinished }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Simulación de tiempo de carga (puedes cambiar esto por la lógica de carga real)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true); // Empieza la animación de cierre
      setTimeout(() => {
        onLoadingFinished(); // Llama a la función para mostrar la página principal
      }, 1000); // Duración de la animación de salida (1 segundo)
    }, 2500); // Tiempo que dura la pantalla de carga (2.5 segundos)

    return () => clearTimeout(timer);
  }, [onLoadingFinished]);

  return (
    <div className={`splash-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="splash-content">
        {/* Aquí dibujamos tu patrón con SVG o elementos divs */}
        <div className="ns-loader">
          <div className="loader-line line-1"></div>
          <div className="loader-line line-2"></div>
        </div>
        <p className="splash-text">Desbloqueando NextStepp...</p>
      </div>
    </div>
  );
};

export default SplashScreen;