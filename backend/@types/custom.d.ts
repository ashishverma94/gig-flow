import { Request } from "express";
import { IUser } from "../models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}


export interface UserRequest extends Request {
  user?: Iuser;
}
