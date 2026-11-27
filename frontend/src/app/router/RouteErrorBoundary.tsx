import { Component, type ErrorInfo, type ReactNode } from "react";

interface RouteErrorBoundaryProps {
    children: ReactNode;
}

interface RouteErrorBoundaryState {
    hasError: boolean;
    message: string;
}

export class RouteErrorBoundary extends Component<
    RouteErrorBoundaryProps,
    RouteErrorBoundaryState
> {
    state: RouteErrorBoundaryState = {
        hasError: false,
        message: "",
    };

    static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
        return {
            hasError: true,
            message: error.message || "Unexpected rendering error.",
        };
    }

    componentDidCatch(_error: Error, _info: ErrorInfo): void {}

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="max-w-md rounded-2xl border border-walnut/20 bg-surface/95 p-6 shadow-md">
                        <h2 className="font-serif text-xl font-bold text-darkBrown dark:text-cream mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-walnut/80 dark:text-cream/70 mb-5">
                            {this.state.message}
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold transition-colors"
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
