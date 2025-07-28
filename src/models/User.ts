import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    handle: string
    name: string
    email: string
    password: string
    description: string
    image: string
    links: string //Luego se transforma a array... (string por id Drag and Drop)
}

const userSchema = new Schema({
    handle:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    links: {
        type: String,
        default: '[]',
    }
})


const User = mongoose.model<IUser>('User', userSchema)
export default User