#!/bin/bash

# Script para construir a aplicação e copiar arquivos estáticos

echo "🚀 Iniciando build do projeto LinkTree..."

# Compilar TypeScript
echo "📦 Compilando TypeScript..."
npx tsc

# Verificar se a compilação foi bem-sucedida
if [ $? -ne 0 ]; then
  echo "❌ Erro na compilação TypeScript"
  exit 1
fi

# Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p dist/views
mkdir -p dist/public

# Copiar arquivos EJS
echo "📂 Copiando templates EJS..."
cp -r src/views/* dist/views/

# Copiar arquivos estáticos
echo "📂 Copiando arquivos estáticos..."
cp -r src/public/* dist/public/

# Criar diretório de dados se não existir
mkdir -p data

echo "✅ Build concluído com sucesso!"
echo "📝 Use 'npm start' para iniciar a aplicação"
