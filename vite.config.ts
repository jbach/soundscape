import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  base: `${process.env.BASE_PATH ?? ''}/`,
  server: { open: true },
  plugins: [react(), tsconfigPaths(), eslint()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
