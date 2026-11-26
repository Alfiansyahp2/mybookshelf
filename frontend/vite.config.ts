import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "vendor-react",
                            test: /node_modules[\\/](react|react-dom|react-router-dom|react-router)[\\/]/,
                        },
                        {
                            name: "vendor-charts",
                            test: /node_modules[\\/](recharts|d3-.*|victory-vendor)[\\/]/,
                        },
                        {
                            name: "vendor-motion",
                            test: /node_modules[\\/](framer-motion|animejs)[\\/]/,
                        },
                        {
                            name: "vendor-dnd",
                            test: /node_modules[\\/]@dnd-kit[\\/]/,
                        },
                        {
                            name: "vendor-i18n",
                            test: /node_modules[\\/](i18next|react-i18next|i18next-browser-languagedetector)[\\/]/,
                        },
                        {
                            name: "vendor-data",
                            test: /node_modules[\\/](@tanstack|axios|zustand|lucide-react|zod|react-hook-form)[\\/]/,
                        },
                    ],
                },
            },
        },
    },
});
