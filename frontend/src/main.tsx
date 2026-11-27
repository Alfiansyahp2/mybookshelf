import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { initTelemetry } from "@shared/lib/telemetry";
import "./index.css";
import "./app/i18n";
import App from "./app/App.tsx";

void initTelemetry();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </StrictMode>,
);
