import { AccountRepository } from './../infra/repository/account.repository';
import { AccountEntity } from '../domain/entity/account.entity';

export type SignUpServiceDto = {
    name: string;
    email: string;
    cpf: string;
    carPlate?: string;
    isPassenger?: boolean;
    isDriver?: boolean;
};

export class SignUpService {
    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(props: SignUpServiceDto): Promise<string> {
        const accountFromRepository = await this.accountRepository.getAccountByEmail(props.email);
        if (accountFromRepository) throw new Error('Usuário já cadastrado');
        const account = AccountEntity.create(
            props.name,
            props.email,
            props.cpf,
            props.carPlate,
            !!props.isPassenger,
            !!props.isDriver,
        );
        await this.accountRepository.saveAccount(account);
        return account.accountId;
    }
}