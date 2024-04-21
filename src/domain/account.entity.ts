import { validateCpf } from './validate-cpf';
import crypto from 'node:crypto';

enum ERROR_MESSAGE {
    INVALID_CPF = 'CPF informado inválido',
    INVALID_EMAIL = 'E-mail informado é inválido',
    INVALID_FULL_NAME = 'Nome precisa ser completo',
    INVALID_CAR_PLATE = 'Placa do carro inválida',
};

export class AccountEntity {
	private constructor(readonly accountId: string, readonly name: string, readonly email: string, readonly cpf: string, readonly isPassenger: boolean, readonly isDriver: boolean, readonly carPlate: string) {
		if (!this.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error(ERROR_MESSAGE.INVALID_FULL_NAME);
		if (!this.email.match(/^(.+)@(.+)$/)) throw new Error(ERROR_MESSAGE.INVALID_EMAIL);
		if (!validateCpf(this.cpf)) throw new Error(ERROR_MESSAGE.INVALID_CPF);
		if (!!this.isDriver && !!this.carPlate && !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error(ERROR_MESSAGE.INVALID_CAR_PLATE);
	}

	static create(name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean): AccountEntity {
		const accountId = crypto.randomUUID();
		return new AccountEntity(accountId, name, email, cpf, isPassenger, isDriver, carPlate);

	}

	static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean): AccountEntity {
		return new AccountEntity(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
	}
}