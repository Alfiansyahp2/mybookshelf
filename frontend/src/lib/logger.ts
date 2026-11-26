/**
 * Development-only error logger so production consoles remain clean.
 */
export function devError(context: string, error?: unknown): void {
    if (import.meta.env.DEV) {
        if (error !== undefined) {
            console.error(context, error);
        } else {
            console.error(context);
        }
    }
}
