# Usa Node come base
FROM node:18

# Crea cartella app
WORKDIR /app

# Copia tutti i file
COPY . .

# Installa dipendenze
RUN npm install

# Genera Prisma Client
RUN npx prisma generate

# App ascolta su 4000
ENV PORT=4000

# Espone la porta
EXPOSE 4000

# Comando di avvio
CMD ["node", "server.js"]

