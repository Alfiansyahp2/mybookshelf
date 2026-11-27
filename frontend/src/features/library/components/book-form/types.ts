import type { BookFormat, BookHeight, BookStatus, BookThickness } from "@shared/types";

export interface BookBasicInfoFormData {
    title: string;
    author: string;
    isbn: string;
    genres: string[];
    language: string;
    publisher: string;
    publishYear: string;
    pages: string;
    format: BookFormat;
}

export interface BookFormData extends BookBasicInfoFormData {
    status: BookStatus;
    height: BookHeight;
    thickness: BookThickness;
    color1: string;
    color2: string;
    color3: string;
    purchaseDate: string;
    purchasePrice: string;
    purchaseCurrency: string;
    purchaseLocation: string;
    acquisitionType: "purchased" | "gift" | "borrowed";
    giftFrom: string;
    borrowedFrom: string;
    borrowedBy: string;
    borrowedDate: string;
    dueDate: string;
}
