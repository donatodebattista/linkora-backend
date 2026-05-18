import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // logs para ver que llega en los logs de Render
    console.log("=== DEBUG CORS ===");
    console.log("Origin recibido:", origin);
    console.log("FRONTEND_URL configurado:", process.env.FRONTEND_URL);

    const allowedOrigins = [process.env.FRONTEND_URL];

    if (process.argv[2] === '--api') {
        allowedOrigins.push(undefined);
    }

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        console.log(`CORS RECHAZADO: ${origin} no está en`, allowedOrigins);
        callback(new Error('ERROR de CORS: Acceso Denegado'));
    }
  }
};