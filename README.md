# 🔗 URL Shortener - TDD

Projeto desenvolvido com **Node.js, TypeScript, TypeORM e Jest**, seguindo o fluxo **TDD** (Test Driven Development).  
Funcionalidades principais: encurtar URLs, autenticação de usuários, redirecionamento e métricas.

---

## 🚀 Tecnologias
- Node.js + Express
- TypeScript
- TypeORM + SQLite (ou outro DB configurável)
- JWT (autenticação)
- Jest + Supertest (testes automatizados)

---

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/url-shortener-tdd.git
cd url-shortener-tdd
npm install
```

Configure o banco no arquivo **`src/config/data-source.ts`** (já vem com SQLite configurado para testes).

---

## ▶️ Rodando o projeto

```bash
npm run dev
```

Servidor disponível em: **http://localhost:3000**

---

## 🧪 Rodando os testes

```bash
npm test
```

Todos os testes de autenticação, links, redirecionamento e métricas devem passar ✅  

Para ver cobertura:

```bash
npm run test:coverage
```

---

## 🔐 Rotas da API

### **Auth**
- `POST /auth/register` → registrar novo usuário  
- `POST /auth/login` → autenticar e receber JWT  
- `POST /auth/logout` → logout  

### **Links**
- `POST /links` → criar novo link (precisa JWT)  
- `GET /links` → listar links do usuário autenticado  

### **Redirecionamento**
- `GET /s/:slug` → redireciona para a URL original  

### **Métricas globais**
- `GET /metrics/summary` → totais de links e cliques  
- `GET /metrics/top` → top links mais acessados  

### **Dashboard do usuário**
- `GET /dashboard/summary` → métricas do usuário autenticado  
- `GET /dashboard/top` → top links do usuário autenticado  

---

## 📖 Fluxo de Uso
1. Registrar um usuário (`/auth/register`)  
2. Fazer login (`/auth/login`) e obter o token JWT  
3. Criar links (`/links`) passando o token  
4. Acessar links encurtados em `/s/:slug`  
5. Consultar métricas em `/metrics` ou `/dashboard`  

---

## ✅ Status
Todos os testes passaram (`npm test`) 🎉  
Cobertura total implementada para controllers principais.
