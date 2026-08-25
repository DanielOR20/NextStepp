Actua como un desarrollodor full stack en paginas de desarrollo web 
la pagina es sobre un sistema para empresa de empleabilidad 
Que debe tener la pagina: 
1. ofertas de empresas: con vacante y descripcion del puesto
2. palabras de clave segun los puestos y las empresas 
3. perfil profesional que la persona se regriste para que le lleguen las ofertas de trabajo segun el perfil que se registre
4. calificacion de los usuarios en porcentaje 
5. tenga ia atraves de una api que consulte informacion  groq
6. que tenga un banner flotante que tenga: inicio,calificaciones, boton de busqueda donde pueda buscar empleos por palabra cifrada,ubicacion,boton para crear cv   
7. footer con la informacion necesaria del contacto de la pagina 
la pagina tiene que ser innovadora,moderna con un estilo dirente, con un fondo animado
REQUISITOS DEL FONDO ANIMADO:
1. Contenedor Base: Ocupa el 100% del viewport (position: fixed; top:0; left:0; width:100vw; height:100vh; z-index: -1; overflow: hidden; background: #0b0f19).
2. Elementos Animados:
   - Crea 3 o 4 elementos circulares grandes (orbes) con efectos de degradado radiante y desfoque intenso (filter: blur(80px) o backdrop-filter).
   - Aplica animaciones CSS @keyframes con tiempos desiguales (ej. 15s, 22s, 18s) para que la rotación y traslación parezcan orgánicas y no repetitivas.
3. Capa de Detalle Holográfico:
   - Agrega un overlay de patrón de puntos o malla sutil (grid/dots pattern) superpuesto con opacidad baja (0.1) para mantener el tono corporativo y sofisticado.
4. Optimización de Rendimiento:
   - Utiliza will-change: transform y transform: translate3d(0,0,0) para garantizar que las animaciones se procesen vía GPU a 60 FPS sin ralentizar la interfaz principal.
 
