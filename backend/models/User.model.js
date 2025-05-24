import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name'],
    },
    email:{
        type: String,
        required:[true, 'Please enter your email'],
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
        select: false,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
},
{
    timestamps: true,
}
);

export const User = mongoose.model('User', userSchema);

export default User;


