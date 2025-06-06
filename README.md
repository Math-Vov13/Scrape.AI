# Scrape.AI

<h3>"🔥  Unlock the Power of your Enterprise Data "</h3>

Unlock the Power of Your Enterprise Data 

SCRAPE.AI transforms scattered company files into a single, intelligent AI assistant. 

Search less, know more — ask any question and get instant, accurate answers powered by your internal knowledge. 

No more digging through folders. Just insight, on demand. 


**Documentation:**
- Front [doc](./front/README.md)
- API [doc](./server/README.md)
- MCP [doc](./mcp-server/README.md)

## 🔨 Stack
Frontend
- NextJS
- Tailwind
- React

Backend
- API Rest - FastAPI
- MCP Server - RCP - FastAPI
- OpenAI API
- MongoDB

## ➕ Features
- 🥽 Showcase WebSite
- 🤖 Custom ChatBot linked with entreprise files
- 🪛 Multiple Tools used by ChatBot to interact with files
- ⚙️ Admin Panel
- ⚫ DataBase

## ⚡ Quick Start

For each repertory, create .env from .env.example:
```sh
copy ./front/.env.example ./front/.env # Add API URL

copy ./server/.env.example ./server/.env # Add OpenAI api key
```

Start Docker (backend):
```sh
docker-compose up --build
```

Start SSR (frontend):
```sh
cd ./front # front dir

npm install # install packages
npm run dev # run server
```

Stop Docker Container:
```sh
docker-compose down --V
```

Stop SSR:
```Ctrl + c```

</br>

## 👤 Authors
- Clément
- Mathéo
- Bastien
- Salah

## 📜 License
- MIT