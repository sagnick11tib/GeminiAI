import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { uniqueNamesGenerator, adjectives, names, starWars } from 'unique-names-generator';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
 
 const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;//save the refresh token in the user document
        await user.save({ validateBeforeSave: false });//save the user document

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
 };
 const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find();
    if(!users) {
        throw new ApiError(404, "No users found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,users)) 
});
 const userSignup = asyncHandler(async (req,res) =>{
    const { name, email, password } = req.body;

    if( 
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    });
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res
    .status(201)
    .json(new ApiResponse(200,createdUser,"User created successfully"));

 })

 const userSignupAsGuest = asyncHandler(async (req,res) => {
    //how to identify a guest user?
    //guest user will have a random name, email and password

    const name = uniqueNamesGenerator({ // generate a random name for the guest like "Luke Skywalker"
        dictionaries: [names, starWars, adjectives],
        length: 1,
    });
    const email = `${name.toLowerCase()}@guest.com`; // email will be guest name in lowercase with @guest.com
    const password = name.toLowerCase().split(" ").join(""); // password will be guest name in lowercase without spaces

    const existing = await User .findOne({
        email
    });

    if(existing) {
        throw new ApiError(409, "Guest with email already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        guestFlag: true
    });

    const created = await User.findById(user._id).select("-password -refreshToken");

    if(!created) {
        throw new ApiError(500, "Something went wrong while creating guest");
    }

    return res
    .status(201)
    .json(new ApiResponse(200,created,"Guest created successfully"));
    });

    const userLogin = asyncHandler(async (req,res) => {
        const { email, password } = req.body;
        if(!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }
        const user = await User.findOne({ email });
        if(!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordValid = await user.isPasswordMatch(password);

        if(!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,{user: loggedInUser, accessToken, refreshToken}, "User logged in successfully"));

    });

    const userLogout = asyncHandler(async (req,res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {$unset:{refreshToken:1}},{new:true}
        )
        const options = {httpOnly:true,secure:true}

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200,{},"User logged out successfully"));
    });

    export { getAllUsers, userSignup, userSignupAsGuest, userLogin, userLogout }
    


