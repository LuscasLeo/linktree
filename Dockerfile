FROM node:20-alpine as builder

# Diretório de trabalho
WORKDIR /app

# Instalar dependências
COPY package*.json ./
COPY setup.sh ./
RUN chmod +x setup.sh
RUN pwd

RUN npm ci

# Copiar arquivos de configuração
COPY tsconfig.json ./
COPY build.sh ./
RUN chmod +x build.sh

# Copiar código fonte
COPY src/ src/

# Compilar a aplicação
RUN npm run build

# Estágio de produção para reduzir o tamanho da imagem
FROM node:20-alpine

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_DIRECTORY=/app/data
ENV TZ=America/Sao_Paulo

# Criar usuário não-root para maior segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários para a execução
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/views ./dist/views
COPY --from=builder /app/src/public ./dist/public
COPY README.docker.md ./README.md
COPY --from=builder /app/setup.sh ./
RUN chmod +x setup.sh

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Criar diretório de dados e configurar permissões
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

# Mudar para o usuário não-root
USER appuser

# Volume para persistência do banco de dados
VOLUME ["/app/data"]

# Expor porta
EXPOSE 3000

# Adicionar metadados OCI
LABEL org.opencontainers.image.title="Linktree Clone"
LABEL org.opencontainers.image.description="Uma aplicação web que imita a funcionalidade do Linktree, permitindo criar e gerenciar links em uma única página."
LABEL org.opencontainers.image.authors="Linktree Clone Developer"
LABEL org.opencontainers.image.url="https://github.com/yourusername/linktree"
LABEL org.opencontainers.image.documentation="https://github.com/yourusername/linktree"
LABEL org.opencontainers.image.source="https://github.com/yourusername/linktree"
LABEL org.opencontainers.image.licenses="MIT"

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
