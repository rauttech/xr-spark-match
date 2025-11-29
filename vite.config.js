import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    server: {
        https: true,
        host: true, // Open to local network and display URL
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
                secure: false,
            },
        },
    },

    plugins: [mkcert()],
});
