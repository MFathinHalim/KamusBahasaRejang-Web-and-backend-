# Menggunakan image Node.js sebagai dasar
FROM node:14

# Menentukan direktori kerja dalam kontainer
WORKDIR /app

# Menyalin file package.json dan package-lock.json ke dalam kontainer
COPY package*.json ./

# Menginstal dependensi aplikasi
RUN npm install

# Menyalin seluruh kode sumber aplikasi ke dalam kontainer
COPY . .

# Menjalankan aplikasi saat kontainer dimulai
CMD [ "node", "app.js" ]

