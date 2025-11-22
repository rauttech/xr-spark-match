import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
    plugins: [basicSsl()],
    server: {
        https: true,
        host: true, // Expose to network for Quest
        port: 3000
    },
    test: {
        globals: true,
        environment: 'jsdom',
    }
});
