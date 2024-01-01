import express, { Express, Request, Response } from "express";
const app = express()
import mongoose from "mongoose";
import amqp from 'amqplib'
import { Order } from "./Order";

mongoose.connect("mongodb://localhost/orderservice")
    .then(() => {
        console.log("order-service database connected");
    })
    .catch((err) => {
        console.log("database connection failed :", err);
    })


var channel: any, connection: amqp.Connection | null = null

app.use(express.json())

// CREATE ORDER FUNCTION

function createOrder(products: Array<any>, userEmail: string){
    let total  = 0;
    for(let t = 0; t < products.length; ++t){
        total+= products[t].price;
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total
    })
     newOrder.save()
    return newOrder
    
}

async function connect (){
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel()
    channel.assertQueue("ORDER")
}
connect().then(async ()=>{
    await channel.consume("ORDER", (data: any)=>{
        console.log("Consuming ORDER service");
        const {products, userEmail} = JSON.parse(data.content);
        const newOrder = createOrder(products, userEmail);
        channel.ack(data);
        console.log(newOrder);
        
        channel.sendToQueue(
            "PRODUCT",
            Buffer.from(JSON.stringify({newOrder}))
        )
    })
})

app.listen('8002', () => {
    console.log("Server running on port 8002 ");
})
