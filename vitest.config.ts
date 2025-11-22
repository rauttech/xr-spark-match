import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node', // Using node for logic tests, jsdom for component/scene if needed
        include: ['tests/unit/**/*.test.ts'],
    },
});
