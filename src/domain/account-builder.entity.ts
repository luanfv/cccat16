import { AccountEntity } from './account.entity'

export class AccountBuilderEntity {
    private _props: AccountEntity;

    constructor() {
        this._props = AccountEntity.create(
            'John Doe',
            `john${Math.random()}@gmail.com`,
            '97456321558',
            'ABC1234',
            false,
            true,
        );
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