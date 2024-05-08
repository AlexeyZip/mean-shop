export interface ProductDTO {
    id: string | null,
    title: string,
    description: string,
    imagePath?: string;
    price: number
}