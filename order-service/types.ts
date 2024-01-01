
export interface Products{
    product_id: string;
}
export interface OrderTypes{
    products: Products[];
    user: string;
    total_price: number;
    created_at: Date
}