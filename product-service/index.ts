import express, { Express, Request, Response } from "express";
const app = express()
import mongoose from "mongoose";
import { Product } from "./Product";
import jwt from 'jsonwebtoken';
import amqp from 'amqplib'
import verifyToken from '../common/verifyToken';

mongoose.connect("mongodb://localhost/productservice")
    .then(() => {
        console.log("Product-service database connected");
    })
    .catch((err) => {
        console.log("database connection failed :", err);
    })
var channel: any, connection: amqp.Connection | null = null

app.use(express.json())

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel()
    await channel.assertQueue("PRODUCT")
}
connect()

// ROUTE TO BUY PRODUCT

app.post("/product/buy", verifyToken, async(req: Request, res: Response)=>{
    const {ids} = req.body;
    const products = await Product.find({_id: {$in: ids}});
    return res.json(products)
})

// ROUTE TO CREATE PRODUCT

app.post('/product/create', verifyToken, async(req: Request, res: Response)=>{
    const {name, description, price} = req.body;
    const newProduct = new Product({
        name, 
        description,
        price
    })
    await newProduct.save();
    return res.json(newProduct)
})

app.listen('8001', () => {
    console.log("Server running on port 8001 ");
})
