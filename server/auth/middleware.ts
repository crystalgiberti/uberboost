import { Request, Response, NextFunction } from "express";
import { queries } from "../database.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const session = queries.getSession.get(token) as any;

    if (!session) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.user = {
      id: session.user_id,
      email: session.email,
      first_name: session.first_name,
      last_name: session.last_name,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    try {
      const session = queries.getSession.get(token) as any;
      if (session) {
        req.user = {
          id: session.user_id,
          email: session.email,
          first_name: session.first_name,
          last_name: session.last_name,
        };
      }
    } catch (error) {
      // Ignore auth errors for optional auth
      console.warn("Optional auth failed:", error);
    }
  }

  next();
}
