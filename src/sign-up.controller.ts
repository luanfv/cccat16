import { Request, Response } from 'express';
import { SignUpService } from './sign-up.service';

export class SignUpController {
    constructor(private readonly signUpService: SignUpService = new SignUpService()) {}

    async post(req: Request, res: Response) {
        await this.signUpService.execute(req.body, res);
    }
}