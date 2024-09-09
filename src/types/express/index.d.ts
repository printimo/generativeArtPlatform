import { User } from '../../models/userModel'; // Adjust the import path as needed

declare namespace Express {
        export interface Request {
            user?: User;
        }
    }