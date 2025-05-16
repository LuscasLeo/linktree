import { Request, Response } from 'express';
import { LinkModel } from '../models/LinkModel';

export class PublicController {
  /**
   * Renderiza a página inicial com os links
   */
  static async homePage(req: Request, res: Response) {
    try {
      const links = await LinkModel.getAllActive();
      res.render('public/home', { 
        links,
        title: 'Meu Linktree'
      });
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      res.status(500).render('public/error', { 
        error: 'Ocorreu um erro ao carregar os links',
        title: 'Erro'
      });
    }
  }

  /**
   * Página de erro 404
   */
  static notFound(req: Request, res: Response) {
    res.status(404).render('public/error', { 
      error: 'Página não encontrada',
      title: 'Erro 404'
    });
  }
}
