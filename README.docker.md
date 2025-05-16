# Linktree Clone

![Docker Pulls](https://img.shields.io/docker/pulls/linktreeclone/linktree) ![Docker Image Size](https://img.shields.io/docker/image-size/linktreeclone/linktree)

Uma aplicação web que permite criar e gerenciar links em uma única página, inspirada no [Linktree](https://linktr.ee/).

## 🚀 Início Rápido

Inicie rapidamente com Docker Compose:

```bash
# Criar arquivo docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  app:
    image: linktreeclone/linktree:latest
    ports:
      - "3000:3000"
    volumes:
      - linktree-data:/app/data
    environment:
      - SESSION_SECRET=seu_segredo_aqui

volumes:
  linktree-data:
EOF

# Executar o container
docker-compose up -d
```

Acesse:
- 🌐 **Página pública**: http://localhost:3000
- ⚙️ **Painel admin**: http://localhost:3000/admin
- 🔑 **Credenciais**: admin / admin123

## 📝 Características

- **Página pública** moderna e responsiva
- **Painel administrativo** protegido
- **Gerenciamento completo de links**:
  - Criar, editar e excluir links
  - Reordenar links via drag-and-drop
  - Ativar/desativar links
- **SQLite** para armazenamento persistente

## 🐳 Opções do Docker

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `DB_DIRECTORY` | Diretório do banco de dados | `/app/data` |
| `SESSION_SECRET` | Chave de sessão | `linktree-secret-key` |
| `SESSION_EXPIRY` | Expiração da sessão (ms) | `86400000` (24h) |

### Volumes

- `/app/data` - Armazenamento do banco de dados SQLite
- `/app/dist/public/images` - Armazenamento de imagens

### Exemplo com docker run

```bash
docker run -d \
  --name linktree \
  -p 3000:3000 \
  -e SESSION_SECRET=my_secure_secret \
  -v linktree_data:/app/data \
  -v ./images:/app/dist/public/images \
  linktreeclone/linktree:latest
```

## 🔧 Personalização

Para personalizar sua instância:

1. **Imagem de perfil**: Monte um volume em `/app/dist/public/images` e adicione uma imagem `profile.jpg`.

2. **CSS personalizado**: Modifique o arquivo CSS e monte como volume:
   ```bash
   -v ./custom-style.css:/app/dist/public/css/style.css
   ```

## 🛡️ Segurança

É importante alterar a senha padrão do administrador após o primeiro login.

## 🔄 Atualização

Para atualizar para uma nova versão:

```bash
docker-compose pull
docker-compose down
docker-compose up -d
```

## 🤝 Contribuição

Contribuições são bem-vindas! Visite nosso [repositório GitHub](https://github.com/yourusername/linktree) para mais informações.

## 📜 Licença

Este projeto está licenciado sob a licença MIT.
