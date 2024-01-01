import mongoose,{Types, Schema, model} from "mongoose";

import { ProductTypes } from "./types";


const ProductSchema = new Schema<ProductTypes>({
    name: String,
    price: Number,
    description: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Product = model("Product", ProductSchema)

export {Product, ProductTypes}