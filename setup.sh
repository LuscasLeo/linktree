#!/bin/sh
# Script de inicialização para configurar variáveis de ambiente

# Verificar se o arquivo .env existe, caso contrário criar a partir do exemplo
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "Arquivo .env não encontrado. Criando a partir do .env.example..."
    cp .env.example .env
    echo "Arquivo .env criado. Por favor, edite-o para configurar suas variáveis de ambiente."
  else
    echo "AVISO: Arquivos .env e .env.example não encontrados."
    echo "Criando arquivo .env com valores padrão..."
    
    cat > .env << EOF
# Configuração do Linktree Clone
PORT=3000
DB_DIRECTORY=./data
SESSION_SECRET=$(openssl rand -hex 32)
SESSION_EXPIRY=86400000
EOF

    echo "Arquivo .env criado com valores padrão."
  fi
fi

# Criar diretório de dados se não existir
DB_DIR=$(grep DB_DIRECTORY .env | cut -d= -f2 || echo "./data")
if [ "$DB_DIR" = "" ]; then
  DB_DIR="./data"
fi

mkdir -p $DB_DIR
echo "Diretório de dados configurado: $DB_DIR"

# Verificar se o NODE_ENV está configurado
if [ -z "$NODE_ENV" ]; then
  echo "NODE_ENV não está configurado. Usando 'development' como padrão."
  export NODE_ENV=development
fi

echo "Configuração concluída. Execute 'npm start' para iniciar a aplicação."
