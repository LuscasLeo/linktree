import { Request, Response } from 'express';
import { LinkModel } from '../models/LinkModel';
import { UserModel } from '../models/UserModel';
import { Link } from '../models/types';

export class AdminController {
  /**
   * Renderiza a página de login
   */
  static loginPage(req: Request, res: Response) {
    res.render('admin/login', { 
      title: 'Login - Admin',
      error: req.query.error 
    });
  }

  /**
   * Processa o login do usuário
   */
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    
    try {
      const user = await UserModel.validateCredentials(username, password);
      
      if (!user) {
        return res.redirect('/admin/login?error=Credenciais inválidas');
      }
      
      // Armazenar o ID do usuário na sessão
      req.session.userId = user.id;
      req.session.username = user.username;
      
      // Redirecionar para a página que o usuário tentou acessar originalmente
      const returnTo = req.session.returnTo || '/admin';
      delete req.session.returnTo;
      
      res.redirect(returnTo);
    } catch (error) {
      console.error('Erro no login:', error);
      res.redirect('/admin/login?error=Erro ao processar o login');
    }
  }

  /**
   * Efetua o logout do usuário
   */
  static logout(req: Request, res: Response) {
    req.session.destroy(err => {
      if (err) {
        console.error('Erro ao encerrar sessão:', err);
      }
      res.redirect('/admin/login');
    });
  }

  /**
   * Renderiza o dashboard admin
   */
  static async dashboard(req: Request, res: Response) {
    try {
      const links = await LinkModel.getAll();
      res.render('admin/dashboard', { 
    req,

        links,
        username: req.session.username,
        title: 'Dashboard - Admin',
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      res.status(500).render('admin/error', { 
        error: 'Erro ao carregar o dashboard',
        title: 'Erro'
      });
    }
  }

  /**
   * Renderiza o formulário para criar um novo link
   */
  static createLinkPage(req: Request, res: Response) {
    res.render('admin/link-form', { 
        req,
      link: { title: '', url: '', active: true, order_index: 0 },
      isNew: true,
      title: 'Criar Link - Admin'
    });
  }

  /**
   * Renderiza o formulário para editar um link existente
   */
  static async editLinkPage(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
      const link = await LinkModel.getById(parseInt(id));
      
      if (!link) {
        return res.redirect('/admin?error=Link não encontrado');
      }
      
      res.render('admin/link-form', { 
        link,
        isNew: false,
        title: 'Editar Link - Admin'
      });
    } catch (error) {
      console.error('Erro ao buscar link para edição:', error);
      res.redirect('/admin?error=Erro ao buscar link');
    }
  }

  /**
   * Processa a criação de um novo link
   */
  static async createLink(req: Request, res: Response) {
    const { title, url, active, order_index } = req.body;
    
    try {
      const link: Link = {
        title: title || null,
        url,
        order_index: parseInt(order_index) || 0,
        active: active === 'on' || active === true
      };
      
      await LinkModel.create(link);
      res.redirect('/admin?success=Link criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar link:', error);
      res.redirect('/admin/links/new?error=Erro ao criar link');
    }
  }

  /**
   * Processa a atualização de um link existente
   */
  static async updateLink(req: Request, res: Response) {
    const { id } = req.params;
    const { title, url, active, order_index } = req.body;
    
    try {
      const linkId = parseInt(id);
      const link: Link = {
        title: title || null,
        url,
        order_index: parseInt(order_index) || 0,
        active: active === 'on' || active === true
      };
      
      const success = await LinkModel.update(linkId, link);
      
      if (success) {
        res.redirect('/admin?success=Link atualizado com sucesso');
      } else {
        res.redirect(`/admin/links/${id}/edit?error=Link não encontrado`);
      }
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
      res.redirect(`/admin/links/${id}/edit?error=Erro ao atualizar link`);
    }
  }

  /**
   * Exclui um link
   */
  static async deleteLink(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
      const success = await LinkModel.delete(parseInt(id));
      
      if (success) {
        res.redirect('/admin?success=Link excluído com sucesso');
      } else {
        res.redirect('/admin?error=Link não encontrado');
      }
    } catch (error) {
      console.error('Erro ao excluir link:', error);
      res.redirect('/admin?error=Erro ao excluir link');
    }
  }

  /**
   * Renderiza a página de alteração de senha
   */
  static changePasswordPage(req: Request, res: Response) {
    res.render('admin/change-password', { 
      title: 'Alterar Senha - Admin',
      error: req.query.error,
      success: req.query.success
    });
  }

  /**
   * Processa a alteração de senha do usuário
   */
  static async changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.userId;
    
    if (!userId) {
      return res.redirect('/admin/login');
    }
    
    if (newPassword !== confirmPassword) {
      return res.redirect('/admin/change-password?error=As senhas não coincidem');
    }
    
    try {
      // Verificar a senha atual
      const user = await UserModel.getById(userId);
      
      if (!user) {
        return res.redirect('/admin/login');
      }
      
      const bcrypt = require('bcrypt');
      const isValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValid) {
        return res.redirect('/admin/change-password?error=Senha atual incorreta');
      }
      
      // Atualizar a senha
      await UserModel.updatePassword(userId, newPassword);
      
      res.redirect('/admin/change-password?success=Senha alterada com sucesso');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.redirect('/admin/change-password?error=Erro ao alterar senha');
    }
  }

  /**
   * Atualiza a ordem dos links
   */
  static async updateLinkOrder(req: Request, res: Response): Promise<void> {
    const { linkIds } = req.body;
    
    try {
      if (Array.isArray(linkIds) && linkIds.length > 0) {
        const success = await LinkModel.updateOrder(linkIds.map(id => parseInt(id)));
        
        if (success) {
          res.json({ success: true, message: 'Ordem atualizada com sucesso' });
          return;
        }
      }
      
      res.status(400).json({ success: false, message: 'Dados inválidos para ordenação' });
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
      res.status(500).json({ success: false, message: 'Erro ao atualizar ordem' });
    }
  }
}
