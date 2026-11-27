import { BrowserRouter } from "react-router-dom";
import ToastContainer from "@shared/components/ui/ToastContainer";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { AppRoutes } from "./router/routes";

export default function App() {
    return (
        <ReactQueryProvider>
            <BrowserRouter>
                <AppRoutes />
                <ToastContainer />
            </BrowserRouter>
        </ReactQueryProvider>
    );
}
