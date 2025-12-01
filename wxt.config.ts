import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  imports: {
    addons: {
      react: true,
    },
  },
  vite: () => ({
    plugins: [react()],
    test: {
      environment: 'happy-dom',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      },
    },
  }),
  manifest: {
    name: "Zen Reader",
    description: "Distraction-Free Reader Mode with AI Text-to-Speech",
    version: "2.0.0",
    permissions: [
      "activeTab",
      "storage",
      "contextMenus",
      "scripting",
      "tabs"
    ],
    host_permissions: [
      "<all_urls>"
    ],
    action: {
      default_title: "Open Zen Reader",
    },
  },
});
