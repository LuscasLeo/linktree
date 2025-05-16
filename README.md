# Linktree Clone

Uma aplicação web que imita a funcionalidade do Linktree, permitindo criar e gerenciar links em uma única página.

## Funcionalidades

- **Página pública** com exibição dos links ativos
- **Painel administrativo** protegido por autenticação
- **Gerenciamento de links**:
  - Criar, editar e excluir links
  - Reordenar links com arrastar e soltar
  - Ativar/desativar links
- **Armazenamento** em banco de dados SQLite
- **Segurança** com autenticação e proteção de senhas

## Requisitos

- Node.js (v16+)
- npm ou yarn
- Para Docker: Docker e Docker Compose

## Instalação

### Método 1: Instalação Local

1. Clone o repositório:
   ```
   git clone [url-do-repositorio]
   cd linktree
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente (opcional):
   ```
   cp .env.example .env
   # Edite o arquivo .env conforme necessário
   ```

4. Compile o projeto:
   ```
   npm run build
   ```

5. Inicie a aplicação:
   ```
   npm start
   ```

### Método 2: Usando Docker

1. Clone o repositório:
   ```
   git clone [url-do-repositorio]
   cd linktree
   ```

2. Configure as variáveis de ambiente (opcional):
   ```
   cp .env.example .env
   # Edite o arquivo .env conforme necessário
   ```

3. Construa e execute com Docker Compose:
   ```
   docker-compose up -d
   ```

## Desenvolvimento

Para executar em modo de desenvolvimento com recarga automática:

```
npm run dev
```

## Variáveis de Ambiente

A aplicação pode ser configurada usando as seguintes variáveis de ambiente:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| PORT | Porta em que o servidor será executado | 3000 |
| DB_DIRECTORY | Diretório onde o banco de dados será armazenado | ./data |
| SESSION_SECRET | Chave secreta usada para assinar cookies de sessão | linktree-secret-key |
| SESSION_EXPIRY | Tempo de expiração da sessão (em ms) | 86400000 (24h) |

## Acesso

- **Página pública**: http://localhost:3000
- **Painel administrativo**: http://localhost:3000/admin
- **Credenciais padrão**: 
  - Usuário: `admin` 
  - Senha: `admin123`

## Estrutura do Projeto

- `src/`: Código fonte
  - `config/`: Configurações (banco de dados, etc.)
  - `controllers/`: Controladores para as rotas
  - `middleware/`: Middlewares (autenticação, etc.)
  - `models/`: Modelos e acesso ao banco de dados
  - `public/`: Arquivos estáticos (CSS, JavaScript, imagens)
  - `routes/`: Definições de rotas
  - `views/`: Templates EJS
  - `server.ts`: Ponto de entrada da aplicação

## Customização

Para personalizar a aparência, edite os arquivos:
- `src/public/css/style.css`: Estilos da aplicação
- `src/views/public/home.ejs`: Template da página pública
- `src/public/images/`: Adicione sua imagem de perfil como `profile.jpg`

## Docker

O projeto inclui:
- `Dockerfile` para construir a imagem da aplicação
- `docker-compose.yml` para facilitar a execução com volume persistente para o banco de dados
- `README.docker.md` específico para exibição no DockerHub

### Comandos Docker úteis

```bash
# Construir a imagem
docker build -t linktree-clone .

# Executar o container
docker run -p 3000:3000 -v $(pwd)/data:/app/data linktree-clone

# Usando Docker Compose
docker-compose up -d

# Verificar os logs
docker-compose logs -f

# Parar os containers
docker-compose down

# Publicar no DockerHub manualmente (requer login)
npm run docker:publish

# Ou utilize o GitHub Actions (veja o diretório .github/workflows)
```

### CI/CD com GitHub Actions

Este projeto inclui workflows do GitHub Actions para:

1. **Testes e Linting** (`test.yml`):
   - Executa verificações de tipo TypeScript
   - Realiza o build do projeto
   - Roda em todos os pushes e pull requests

2. **Build e Publicação Docker** (`docker-publish.yml`):
   - Constrói a imagem Docker
   - Publica automaticamente no DockerHub
   - Executa em pushes para main/master e em novas tags

Para configurar, veja o arquivo `.github/GITHUB_ACTIONS_SETUP.md`.
