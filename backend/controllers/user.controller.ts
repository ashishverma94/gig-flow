import jwt from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES = "7d";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body as IRegistrationBody;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as ILoginRequest;

    if (!email || email.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user: IUser | null = await userModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const existingToken = req.cookies["gigflow.token"];
    if (existingToken) {
      try {
        const decoded: any = jwt.verify(existingToken, JWT_SECRET);

        if (decoded.id === user._id.toString()) {
          return res.status(200).json({
            success: true,
            message: "User is already logged in",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          });
        }
      } catch (err) {
        res.clearCookie("gigflow.token");
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    res.cookie("gigflow.token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
