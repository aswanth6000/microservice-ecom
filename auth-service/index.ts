import express, { Express, Request, Response } from "express";
const app = express()
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { User } from "./User";

mongoose.connect("mongodb://localhost/authservice")
.then(()=>{
    console.log("auth-service database connected");
})
.catch((err)=>{
    console.log("database connection failed :", err);
})

app.use(express.json())

// USER LOGIN ROUTE

app.post('/auth/login', async (req: Request, res: Response)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email: email});
        if(!user){
            return res.json({message: "User dosen't exist"});
        }else{
            if(password !== user.password){
                return res.json("messsage: Incorrect Password");
            }
            const payload = {
                email, 
                name: user.username
            }
            jwt.sign(payload, "secret", (err, token )=>{
                if (err) console.log(err);
                else return res.json({token: token})
            });
        }
    } catch (error) {
        console.log(error);
    }
})

//USER REGISTER ROUTE

app.post("/auth/register", async (req: Request, res: Response)=>{
    const {email, username, password} = req.body
    try {
        const userExists = await User.findOne({email: email});
        if(userExists){
            return res.json("User already exists");
        }else{
            const newUser = new User ({
                email, 
                password, 
                username
            })
            newUser.save()
            return res.status(200).json(newUser)
        }
    } catch (error) {
        console.log(error);
    }

})


app.listen('8000', ()=>{
    console.log("Server running on port 8000 ");
})
