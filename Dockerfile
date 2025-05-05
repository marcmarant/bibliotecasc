# Usa una imagen oficial de Node.js como base
FROM node:23-slim

# Instala OpenSSL para Prisma
RUN apt-get update -y && apt-get install -y openssl

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias (package.json y package-lock.json)
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --legacy-peer-deps

# Copia el resto del código de la aplicación
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Compila la aplicación para producción
RUN npm run build

# Expone el puerto en el que la aplicación estará corriendo
EXPOSE 3000

# Comando para ejecutar la aplicación en producción
CMD ["npm", "start"]