import { Router } from 'express';
import { PublicController } from '../controllers/PublicController';

const router = Router();

// Rota principal - exibe os links
router.get('/', PublicController.homePage);

export default router;
