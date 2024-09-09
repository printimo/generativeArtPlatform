declare namespace Express {
    import {User} from "../../models/userModel";
        export interface Request {
            user: User
        }
    }