import { Product } from '../product/product.model';

export interface Order {
  id: string | null;
  products: any[];
  user: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}
