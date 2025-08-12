import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
  origin: function (origin, callback){
    //Permitir acceso a peticiones desde thunderClient cuando se inicia el servidor con dev:api
    const allowedOrigins = [process.env.FRONTEND_URL];
    if (process.argv[2] === '--api'){
        allowedOrigins.push(undefined)
    }

    if (allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error('ERROR de CORS: Acceso Denegado'));
    }
}}