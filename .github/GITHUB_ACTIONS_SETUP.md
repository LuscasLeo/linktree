# Configuração dos Workflows GitHub Actions

Este documento explica como configurar os secrets necessários para que os workflows do GitHub Actions funcionem corretamente.

## Secrets Necessários

Para que o workflow de publicação da imagem Docker funcione, é necessário configurar dois secrets no repositório GitHub:

1. **DOCKERHUB_USERNAME**: Seu nome de usuário no DockerHub
2. **DOCKERHUB_TOKEN**: Um token de acesso pessoal do DockerHub

## Como Configurar os Secrets

1. Acesse seu repositório no GitHub
2. Clique na aba "Settings"
3. No menu lateral, clique em "Secrets and variables" e selecione "Actions"
4. Clique no botão "New repository secret"
5. Adicione os secrets mencionados acima:
   - Nome: `DOCKERHUB_USERNAME`, Valor: seu nome de usuário no DockerHub
   - Nome: `DOCKERHUB_TOKEN`, Valor: seu token de acesso pessoal do DockerHub

## Como Obter um Token do DockerHub

1. Acesse sua conta no [DockerHub](https://hub.docker.com/)
2. Clique no seu nome de usuário no canto superior direito e selecione "Account Settings"
3. Navegue até a seção "Security"
4. Clique em "New Access Token"
5. Dê um nome ao token (ex: "GitHub Actions") e selecione os escopos adequados (pelo menos "Read & Write")
6. Clique em "Generate" e copie o token gerado

## Workflow de Publicação

O workflow `docker-publish.yml` será executado automaticamente nas seguintes condições:
- Quando houver um push para as branches `main` ou `master`
- Quando uma nova tag com prefixo `v` for criada (ex: `v1.0.0`)
- Quando for acionado manualmente através da interface do GitHub Actions

O workflow irá construir a imagem Docker e publicá-la no DockerHub com as tags apropriadas, baseadas na versão ou branch.

## Verificação de Testes

O workflow `test.yml` será executado em todos os pushes para qualquer branch e em pull requests para as branches `main` ou `master`. 
Este workflow realiza:
- Verificação de linting (se configurado)
- Verificação de tipos TypeScript
- Build do projeto

## Dicas

- Para versionar corretamente sua aplicação, use tags semânticas como `v1.0.0`, `v1.1.0`, etc.
- Você pode acionar o workflow manualmente através da interface do GitHub Actions se precisar republicar uma imagem

## Troubleshooting

Se o workflow falhar, verifique:
1. Se os secrets estão configurados corretamente
2. Se o DockerHub token tem permissões suficientes
3. Se o nome do repositório no DockerHub corresponde ao especificado no workflow
4. Os logs de erro detalhados na página de execução do workflow
