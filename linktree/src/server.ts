import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import { initializeDatabase } from './config/database';
import ejs from 'ejs';

// Importar rotas
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import { PublicController } from './controllers/PublicController';

// Inicializar o banco de dados
initializeDatabase()
  .then(() => console.log('Banco de dados inicializado com sucesso'))
  .catch((err) => console.error('Erro ao inicializar banco de dados:', err));

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to inject req into res.locals
app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

// Configurar o mecanismo de visualização EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsing de requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method')); // Para permitir PUT e DELETE em formulários

// Middleware de logging
app.use(morgan('dev'));

// Configurar sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'linktree-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESSION_EXPIRY || '86400000'), // 1 dia por padrão
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para tornar o nome de usuário disponível em todas as views
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

// Rotas da aplicação
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// Middleware de tratamento de erros 404
app.use(PublicController.notFound);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
