import { Request, Response, NextFunction } from "express";


const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user dovrebbe essere valorizzato dal middleware auth precedente
    const user = req.user as { role?: string };
    const userId = String(req.user?.id)
    const paramsId = String(req?.params?.id)


    if (!user || !user.role || !req.user?.id) {
      res.status(401).json({ message: "Unauthorized: no user info" });
      return;
    }

    if (!allowedRoles.includes(user.role) && userId !== paramsId ) {
      res.status(403).json({ message: "Forbidden: insufficient role" });
      return;
    }

    req.user = req.user;

    next();
  };
};

export const roleMiddleware = {
  checkRole,
};
