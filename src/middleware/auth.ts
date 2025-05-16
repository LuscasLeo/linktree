import { Request, Response, NextFunction } from 'express';

// Middleware para verificar se o usuário está autenticado
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Verificar se o usuário está logado
  if (req.session && req.session.userId !== undefined) {
    return next();
  }
  
  // Salvar a URL que o usuário estava tentando acessar para redirecioná-lo depois do login
  if (req.session) {
    req.session.returnTo = req.originalUrl;
  }
  
  res.redirect('/admin/login');
};

// Middleware para usuário já logado
export const isNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId !== undefined) {
    return res.redirect('/admin');
  }
  
  next();
};
