import mongoose,{Types, Schema, model} from "mongoose";

import { UserTypes } from "./types";


const UserSchema = new Schema<UserTypes>({
    username: String,
    email: String,
    password: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const User = model("User", UserSchema)

export {User, UserTypes}