import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(body: {
        username: string;
        password: string;
    }): Promise<any>;
    getProfile(req: any): any;
    signUp(body: {
        username: string;
        password: string;
    }): Promise<any>;
}
