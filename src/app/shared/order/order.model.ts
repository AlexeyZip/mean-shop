import { Product } from '../product/product.model';

export interface Order {
  id: string;
  products: Product[];
  user: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}
