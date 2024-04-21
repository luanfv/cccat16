import crypto from 'node:crypto';
import { AccountEntity } from './account.entity'

export class AccountBuilderEntity {
    private _props: AccountEntity;

    constructor() {
        this._props = {
            name: 'John Doe',
            email: `john${Math.random()}@gmail.com`,
            cpf: '97456321558',
            isDriver: true,
            carPlate: 'ABC1234',
            isPassenger: false,
            accountId: crypto.randomUUID(),
        }
    }

    withInvalidCpf(): AccountBuilderEntity {
        this._props = { ...this._props, cpf: '0' };
        return this;
    }

    withInvalidEmail(): AccountBuilderEntity {
        this._props = { ...this._props, email: 'john' };
        return this;
    }

    withInvalidFullName(): AccountBuilderEntity {
        this._props = { ...this._props, name: 'john' };
        return this;
    }

    withInvalidCarPlate(): AccountBuilderEntity {
        this._props = { ...this._props, carPlate: '0' };
        return this;
    }

    withPassenger(): AccountBuilderEntity {
        this._props = { ...this._props, isPassenger: true, isDriver: false };
        return this;
    }

    build(): AccountEntity {
        return this._props;
    }
}