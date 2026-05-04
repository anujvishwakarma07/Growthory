import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// function to create jwt token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

// signIn logic
export const signup = async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;

        // checking if user already exist or not
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exist with this email."
            });
        }

        // creating new user
        const user = await User.create({
            email,
            password,
            full_name,
            role
        });

        // generate token
        const token = signToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            },
        });
    } catch (error) {
        res.status(500).json({
            error : error.message
        });
    }
} 

//login logic

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // check if email and password exist
        if(!email || !password) {
            return res.status(400).json({
                error : "Please provide email and password."
            });
        }

        // check if user exist or not 
        const existingUser = await User.findOne({email}).select('+password');

        // check if user exist and password is correct
        if(!existingUser || !(await existingUser.comparePassword(password))) {
            return res.status(401).json({
                error : "Invalid email or password."
            });
        }

        // generate token
        const token = signToken(existingUser._id);

        res.status(200).json({
            success : true,
            token,
            user : {
                id : existingUser._id,
                email : existingUser.email,
                full_name : existingUser.full_name,
                role : existingUser.role
            }
        })
    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}