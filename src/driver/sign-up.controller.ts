import { AccountDAO } from '../resource/account-dao';
import { Request, Response } from 'express';
import { SignUpService } from '../application/sign-up.service';
import { AccountDatabaseDAO } from '../resource/account-database.dao';

class SignUpPostResponseDto {
    constructor(readonly accountId: string) {}
}

export class SignUpController {
    private readonly accountDAO: AccountDAO;
    private readonly signUpService: SignUpService;

    constructor() {
        this.accountDAO = new AccountDatabaseDAO();
        this.signUpService = new SignUpService(this.accountDAO);
    }

    async post(req: Request, res: Response) {
        try {
            const accountId = await this.signUpService.execute(req.body);
            return res.status(201).send(new SignUpPostResponseDto(accountId));
        } catch (err: any) {
            if (err instanceof Error) res.status(422).send({ message: err.message });
            return res.status(500).send();
        }
    }
}