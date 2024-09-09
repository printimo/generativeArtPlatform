import { User } from '../../models/userModel';

declare namespace Express {
        export interface Request {
            user?: User;
        }
    }