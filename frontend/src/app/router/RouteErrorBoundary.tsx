import { Component, type ErrorInfo, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { reportClientError } from "@shared/lib/telemetry";

interface InnerErrorBoundaryProps {
    children: ReactNode;
    onResetQueries: () => void;
}

interface RouteErrorBoundaryState {
    hasError: boolean;
    message: string;
}

class InnerErrorBoundary extends Component<
    InnerErrorBoundaryProps,
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

    componentDidCatch(error: Error, info: ErrorInfo): void {
        reportClientError(error, {
            componentStack: info.componentStack,
        });
    }

    private handleRetry = (): void => {
        this.props.onResetQueries();
        this.setState({ hasError: false, message: "" });
    };

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
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={this.handleRetry}
                                className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold transition-colors cursor-pointer"
                            >
                                Try again
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 rounded-xl border border-walnut/25 text-darkBrown dark:text-cream hover:bg-walnut/10 text-sm font-semibold transition-colors cursor-pointer"
                            >
                                Reload page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export function RouteErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <InnerErrorBoundary onResetQueries={reset}>
                    {children}
                </InnerErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
}
