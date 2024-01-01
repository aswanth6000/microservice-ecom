import mongoose,{Types, Schema, model} from "mongoose";

import { OrderTypes } from "./types";


const OrderSchema = new Schema<OrderTypes>({
    products: [{
        product_id: String
    }],
    total_price: Number,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Order = model("Order", OrderSchema)

export {Order, OrderTypes}