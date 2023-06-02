# **Projeto Labeddit Back End**

## 📖 Introdução

O Projeto Labeddit é uma API de posts onde é possível criar uma conta ou logar nela onde é possível também criar posts, podendo curtir e comentar. O projeto também foi feito com o intuito de servir como base para o front onde o mesmo é implementado no programa. Segue o anexo: [clique aqui!](https://github.com/ItaloRochaOliveira/labeddit-front-end/blob/main/README.md)

Os conteúdos principais a serem estudados são:

- Conceito de TypeScript.
- Criação de uma API.
- Conter todos os principais métodos: get, post, put e delete.
- Arquitetura em camadas.
- Programação Orientada a Objeto.
- Autenticação.

STATUS: em processo...

## 🔗Link de Acesso

- Documentação: em processo...

## 📄Concepção do Projeto

### Instalando

```bash
# Instalando dependências
npm install

# executando o projeto
npm run dev e npm run start.

```

### Funcionalidades

```bash
. Requisições:
-SignUp: criar um usuario na API com o método post.
-Login: Entrar com usuário na API com o método post.

-GetPosts: Chamar todos os posts da API, mas só se informar o token criado no login ou
signup, com o método get.
-GetPostById: Chama o post com o id informado, mas só se informar o token criado no login ou
signup, com o método get.
-CreatePost: Pode criar um post na API, mas só se informar o token criado no login ou
signup, com o método post.
-CreateComment: Pode criar um comentário na API, mas só se informar o token criado no login ou
signup, com o método post.

-LikeOrDislikePost - Mecânica de like ou dislike do post da API, mas só se for informado o token
adquirido no login ou signup e o id do post a ser curtido, também será necessário informar
no body o true ou false, onde true é like e false deslike.
-LikeOrDislikeComment - Mecânica de like ou dislike do comentário da API, mas só se for informado o token
adquirido no login ou signup e o id do comentário a ser curtido, também será necessário informar
no body o true ou false, onde true é like e false deslike.
```

### Bibliotecas Utilizadas

```bash
#dependencies:
bcryptjs,
cors,
dotenv,
express,
jsonwebtoken,
knex,
sqlite3,
uuid,
zod

#devDependencies:
@types/bcryptjs,
@types/cors,
@types/express,
@types/jsonwebtoken,
@types/knex,
@types/node,
@types/uuid,
ts-node-dev,
typescript

```

## 💡Programas utilizados:

- VSCode
- PostMan

## 💻Tecnologias

![TypesScript](https://img.shields.io/badge/TypeScript-1572B6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-f8f8ff?style=for-the-badge&logo=express&logoColor=black)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)

## 📫 Contato

<p>Email: italo.rocha.de.oliveira@gmail.com</p>
<a href = "mailto:italo.rocha.de.oliveira@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" alvo ="_blank"></a>
<a href="https://www.linkedin.com/in/italorochaoliveira/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
