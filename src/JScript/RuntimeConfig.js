// Configuración de ejecución del frontend.
// LOCAL: déjalo vacío; ApiConfig usará http://localhost:8080 únicamente en localhost/127.0.0.1.
// PRODUCCIÓN: después de desplegar Spring Boot, coloca aquí su URL HTTPS pública, sin slash final.
// Ejemplo: window.YEYA_CONFIG.API_BASE_URL = "https://api-la-tiendita.example.com";
window.YEYA_CONFIG = window.YEYA_CONFIG || {};
window.YEYA_CONFIG.API_BASE_URL = window.YEYA_CONFIG.API_BASE_URL || "";
