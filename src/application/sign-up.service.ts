import crypto from 'node:crypto';
import { validateCpf } from './validate-cpf';
import { AccountDAO } from '../resource/account.dao';

enum ERROR_MESSAGE {
    INVALID_CPF = 'CPF informado inválido',
    INVALID_EMAIL = 'E-mail informado é inválido',
    INVALID_FULL_NAME = 'Nome precisa ser completo',
    INVALID_CAR_PLATE = 'Placa do carro inválida',
    USER_ALREADY_EXISTS = 'Usuário já cadastrado',
};

export type SignUpServiceDto = {
    name: string;
    email: string;
    cpf: string;
    carPlate?: string;
    isPassenger?: boolean;
    isDriver?: boolean;
};

export class SignUpService {
    constructor(private readonly accountDAO: AccountDAO) {}

    private async validateRules(props: SignUpServiceDto): Promise<void> {
        if (!validateCpf(props.cpf)) throw new Error(ERROR_MESSAGE.INVALID_CPF);
        if (!props.email.match(/^(.+)@(.+)$/)) throw new Error(ERROR_MESSAGE.INVALID_EMAIL);
        if (!props.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error(ERROR_MESSAGE.INVALID_FULL_NAME);
        if (props.isDriver && props.carPlate && !props.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error(ERROR_MESSAGE.INVALID_CAR_PLATE);
        const account = await this.accountDAO.getAccountByEmail(props.email);
        if (!!account) throw new Error(ERROR_MESSAGE.USER_ALREADY_EXISTS);
    }

    private async createUser(props: SignUpServiceDto): Promise<string> {
        const accountId = crypto.randomUUID();
        const {
            name,
            email,
            cpf,
            carPlate,
            isPassenger,
            isDriver,
        } = props;
        await this.accountDAO.saveAccount({
            accountId,
            name,
            email,
            cpf,
            carPlate,
            isPassenger: !!isPassenger,
            isDriver: !!isDriver,
        });
        return accountId;
    }
    
    async execute(props: SignUpServiceDto): Promise<string> {
        await this.validateRules(props);
        const accountId = await this.createUser(props);
        return accountId;
    }
}