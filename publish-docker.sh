#!/bin/sh
# Script para publicar a imagem Docker no DockerHub

# Verificar se o usuário está logado no DockerHub
if ! docker info | grep -q "Username"; then
  echo "Você não está logado no DockerHub. Por favor, faça login:"
  docker login
fi

# Obter versão do package.json
VERSION=$(grep -m1 '"version":' package.json | cut -d'"' -f4)
IMAGE_NAME="luscasleo/linktree"

echo "Construindo imagem Docker versão $VERSION..."
docker build -t $IMAGE_NAME:$VERSION -t $IMAGE_NAME:latest .

echo "Publicando imagem no DockerHub..."
docker push $IMAGE_NAME:$VERSION
docker push $IMAGE_NAME:latest

echo "✅ Imagem publicada com sucesso!"
echo "  - $IMAGE_NAME:$VERSION"
echo "  - $IMAGE_NAME:latest"
