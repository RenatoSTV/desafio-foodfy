

![Foodfy](https://i.imgur.com/e9f39ze.png)

# FoodFy

[![time tracker](https://wakatime.com/badge/github/RenatoSTV/desafio-foodfy.svg)](https://wakatime.com/badge/github/RenatoSTV/desafio-foodfy)
![GitHub](https://img.shields.io/github/license/RenatoSTV/desafio-foodfy)



## 📰 Sobre

<p>Foody é um site com receitas de grandes Chefs da culinária mundial, cadastradas pelos leitores da plataforma.</p>

<p align="center">
  <img src="https://i.imgur.com/bs5B6iz.png">
</p>


### Construido com as seguintes ferramentas:

- Html
- Css
- Javascript
- NodeJS
- PostgreSQL

### Pré-requisitos

- [Node](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)
- [Postbird](https://www.electronjs.org/apps/postbird)
- Conta no [Mailtrap](https://mailtrap.io/) 

## 🔨 Instalação 

1° - Clone o repositório

```
git clone https://github.com/RenatoST/desafio-foodfy.git
```



2° - Instale as dependências

```
npm install
```



3° - No arquivo foodfydb.sql, copie o processo de criação do banco de dados e rode na query do Postbird.

<p align="center">
  <img src="https://i.imgur.com/Lenp1v5.png">
</p>



4° - Configure o arquivo src/config/db.js com o usuário e senha usados na instalação do Postbird.

<p align="center">
  <img src="https://i.imgur.com/wRYi5bD.png">
</p>



5° - Popule o banco de dados utilizando o comando:

```
node seeds.js
```

**Obs:** Para acessar a área administrativa, utilize um dos emails da tabela **users** no Postbird. A senha padrão para os usuários criados pelo seeds é **1111**.



6° - Inicie o projeto

```
npm start
```



Ao criar novos usuários, um e-mail será enviado para a aplicação **Mailtrap**. Acesse o arquivo src/lib/mailer.js e utilize as configurações informadas na sua conta do Mailtrap para que os emails sejam enviados corretamente. 



## ✍ License

Distributed under the MIT License. See [LICENSE](https://github.com/RenatoSTV/desafio-foodfy/blob/master/LICENSE) for more information.



## Issues

Se encontrar algum erro, por favor informe em [ISSUES](https://github.com/RenatoSTV/desafio-foodfy/issues)



## 🔍 Notes

<p>O projeto <strong>Foodfy</strong> foi desenvolvido durante o Bootcamp Launchbase da <a href="https://rocketseat.com.br" alt="Rocketseat" target="_blank">Rocketseat</a>, ministrado pelo professor <a href="https://github.com/maykbrito" alt="Mayk Brito" target="_blank">Mayk Brito</a>.</p>






<p align="center">
  <img width="460" height="300" src="https://camo.githubusercontent.com/268b1344409fac98c4eeda520482b6910c4ddcba/68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f676f6c64656e2d77696e642f626f6f7463616d702d6c61756e6368626173652f6c6f676f2e706e67">
</p>
