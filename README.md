# Clean Code e Clean Architecture
Este conteúdo é parte do curso Clean Code e Clean Architecture da [Branas.io](https://www.branas.io/)

## Dependências do projeto
Para executar o projeto na maquina é necessário ter os seguintes itens instalado:
- [Node/NPM](https://nodejs.org/en/download)
- Docker & Docker compose (recomendação - [Rancher](https://rancherdesktop.io/))

## Execução do projeto
```
# Instalar a dependências necessário para execução do projeto
$ npm i

# Executar o banco de dados pelo Docker Compose
$ docker-compose up -d

# Executar o projeto local/ambiente de desenvolvimento
$ npm start:dev
```

## Execução de testes automatizados
```
# Instalar a dependências necessário para execução do projeto
$ npm i

# Executar o banco de dados pelo Docker Compose
$ docker-compose up -d

# Executar os testes automatizados em ambiente local
$ npm test
```