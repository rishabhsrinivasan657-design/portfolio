import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// `BASE_PATH` lets the same build target either a user site
// (https://<user>.github.io -> '/') or a project site
// (https://<user>.github.io/<repo>/ -> '/<repo>/').
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  assetsInclude: ['**/*.glsl', '**/*.hdr', '**/*.glb'],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    assetsInlineLimit: 1024,
    // Modern target so native CSS nesting survives minification untouched.
    cssTarget: ['chrome112', 'edge112', 'firefox117', 'safari16.4'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/framer-motion')) return 'motion';
        },
      },
    },
  },
  css: {
    modules: {
      generateScopedName:
        process.env.NODE_ENV === 'production'
          ? '[hash:base64:6]'
          : '[name]__[local]__[hash:base64:4]',
    },
  },
  server: {
    port: 7777,
  },
});
