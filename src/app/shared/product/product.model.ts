export interface Product {
  id: string | null;
  title: string;
  description: string;
  productType: string;
  image?: File | any;
  price: number;
  creator: string | null;
}
