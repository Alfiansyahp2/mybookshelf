export type BookDetailTab = "progress" | "session" | "notes" | "info";

export interface BookStatusConfig {
    labelKey: string;
    color: string;
    bg: string;
    border: string;
    dot: string;
    label?: string;
}
