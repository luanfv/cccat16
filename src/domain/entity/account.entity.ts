import crypto from 'node:crypto';
import { NameVO } from '../value-object/name.vo';
import { EmailVO } from '../value-object/email.vo';
import { CpfVO } from '../value-object/cpf.vo';
import { CarPlateVO } from '../value-object/car-plate.vo';

export class AccountEntity {
	private constructor(
		readonly accountId: string,
		private readonly name: NameVO,
		private readonly email: EmailVO,
		private readonly cpf: CpfVO,
		readonly isPassenger: boolean,
		readonly isDriver: boolean,
		private readonly carPlate?: CarPlateVO,
	) {}

	static create(name: string, email: string, cpf: string, carPlate: string | undefined, isPassenger: boolean, isDriver: boolean): AccountEntity {
		const accountId = crypto.randomUUID();
		return new AccountEntity(
			accountId,
			new NameVO(name),
			new EmailVO(email),
			new CpfVO(cpf),
			isPassenger,
			isDriver,
			isDriver ? new CarPlateVO(carPlate ?? '') : undefined,
		);
	}

	static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string | undefined, isPassenger: boolean, isDriver: boolean): AccountEntity {
		return new AccountEntity(
			accountId,
			new NameVO(name),
			new EmailVO(email),
			new CpfVO(cpf),
			isPassenger,
			isDriver,
			isDriver ? new CarPlateVO(carPlate ?? '') : undefined,
		);
	}

	getName() {
		return this.name.getValue();
	}

	getEmail() {
		return this.email.getValue();
	}

	getCpf() {
		return this.cpf.getValue();
	}

	getCarPlate() {
		return this.carPlate?.getValue();
	}

    toObject() {
        return {
            accountId: this.accountId,
            name: this.getName(),
            email: this.getEmail(),
            cpf: this.getCpf(),
            carPlate: this.getCarPlate(),
            isDriver: this.isDriver,
            isPassenger: this.isPassenger,
        }
    }
}