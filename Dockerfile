# Imagem base
FROM node:23

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante da aplicação
COPY . .

# Expor a porta
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
