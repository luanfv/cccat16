import { Request, Response } from 'express';
import { SignUpService } from '../application/sign-up.service';
import { AccountRepository } from '../infra/repository/account.repository';

class SignUpPostResponseDto {
    constructor(readonly accountId: string) {}
}

export class SignUpController {
    private readonly signUpService: SignUpService;

    constructor(private readonly accountRepository: AccountRepository) {
        this.signUpService = new SignUpService(this.accountRepository);
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