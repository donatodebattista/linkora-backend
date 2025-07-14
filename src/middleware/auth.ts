import type { Request, Response, NextFunction } from "express";
import jwt  from 'jsonwebtoken'
import User from '../models/User'


/// Middleware para verificar el token de autenticación
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // Recupera el bearer del encabezado Authorization
  const bearer = req.headers.authorization;

  // Verifica si viene un bearer
  if (!bearer) {
    const error = new Error("Usuario no autorizado. No se ha proporcionado un token de autenticación");
    res.status(401).json({ error: error.message });
    return;
  }

  // Extrae el token del bearer
  const token = bearer.split(" ")[1];

  // verifica si existe el token
  if (!token) {
    const error = new Error("Usuario no autorizado. Token de autenticación inválido");
    res.status(401).json({ error: error.message });
    return;
    }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof result === "object" && result.id) {
      const user = await User.findById(result.id).select("handle name email description");
      if (!user) {
        const error = new Error("El usuario no existe");
        res.status(404).json({ error: error.message });
        return;
      }
      req.user = user // Guarda el usuario en la solicitud para recuperarlo en el siguiente middleware
      next()
    }
  } catch (error) {
    res.status(500).json({ error: "Error al verificar el token de autenticación" });
  }

};
