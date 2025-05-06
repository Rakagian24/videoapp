   /** @type {import('next').NextConfig} */
   const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'], // Tambahkan domain yang diperlukan jika menggunakan gambar dari sumber eksternal
    },
  };

  module.exports = nextConfig;
  