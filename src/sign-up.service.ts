import crypto from 'node:crypto';
import pgPromise from 'pg-promise';
import { validateCpf } from './validateCpf';
import { Response } from 'express';

enum ERROR_CODES {
    INVALID_CPF = '-1',
    INVALID_EMAIL = '-2',
    INVALID_FULL_NAME = '-3',
    INVALID_CAR_PLATE = '-5',
    USER_ALREADY_EXISTS = '-4',
};

type SignUpServiceDto = {
    name: string;
    email: string;
    cpf: string;
    carPlate?: string;
    isPassenger?: boolean;
    isDriver?: boolean;
};

export class SignUpService {
    private readonly connection = pgPromise()('postgres://postgres:123456@localhost:5432/app');
    private readonly FIND_USER_FOR_EMAIL_SCRIPT = 'select * from cccat16.account where email = $1';
    private readonly CREATE_USER_SCRIPT = 'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)';

    private async validateRules(props: SignUpServiceDto): Promise<void> {
        if (!validateCpf(props.cpf)) throw new Error(ERROR_CODES.INVALID_CPF);
        if (!props.email.match(/^(.+)@(.+)$/)) throw new Error(ERROR_CODES.INVALID_EMAIL);
        if (!props.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error(ERROR_CODES.INVALID_FULL_NAME);
        if (props.isDriver && props.carPlate && !props.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error(ERROR_CODES.INVALID_CAR_PLATE);
        const [acc] = await this.connection.query(this.FIND_USER_FOR_EMAIL_SCRIPT, [props.email]);
        if (acc) throw new Error(ERROR_CODES.USER_ALREADY_EXISTS);
    }

    private async createUser(props: SignUpServiceDto): Promise<string> {
        const accountId = crypto.randomUUID();
        await this.connection.query(
            this.CREATE_USER_SCRIPT,
            [
                accountId,
                props.name,
                props.email,
                props.cpf,
                props.carPlate,
                !!props.isPassenger,
                !!props.isDriver,
            ],
        );
        return accountId;
    }
    
    async execute(props: SignUpServiceDto, response: Response): Promise<void> {
        try {
            await this.validateRules(props);
            const accountId = await this.createUser(props);
            response.json({ accountId });
        } catch (err: any) {
            response.status(422).send(err.message);
        }
    }
}