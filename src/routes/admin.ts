import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth';

const router = Router();

// Rotas de autenticação
router.get('/login', isNotAuthenticated, AdminController.loginPage);
router.post('/login', isNotAuthenticated, AdminController.login);
router.get('/logout', AdminController.logout);

// Rotas protegidas - requerem autenticação
router.get('/', isAuthenticated, AdminController.dashboard);

// Gestão de links
router.get('/links/new', isAuthenticated, AdminController.createLinkPage);
router.post('/links', isAuthenticated, AdminController.createLink);
router.get('/links/:id/edit', isAuthenticated, AdminController.editLinkPage);
router.put('/links/:id', isAuthenticated, AdminController.updateLink);
router.delete('/links/:id', isAuthenticated, AdminController.deleteLink);
router.post('/links/order', isAuthenticated, AdminController.updateLinkOrder);

// Alterar senha
router.get('/change-password', isAuthenticated, AdminController.changePasswordPage);
router.post('/change-password', isAuthenticated, AdminController.changePassword);

export default router;
