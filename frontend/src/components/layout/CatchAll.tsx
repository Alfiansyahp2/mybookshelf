import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CatchAll() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/", { replace: true });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-walnut">Redirecting...</div>
        </div>
    );
}
