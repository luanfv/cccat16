import { AccountEntity } from './account.entity'

export class AccountBuilderEntity {
    private _props: AccountEntity;

    constructor(account?: AccountEntity) {
        if (account) {
            this._props = account;
            return;
        }
        this._props = AccountEntity.create(
            'John Doe',
            `john${Math.random()}@gmail.com`,
            '97456321558',
            'ABC1234',
            false,
            true,
        );
    }

    withPassenger(): AccountBuilderEntity {
        const account = AccountEntity.restore(
            this._props.accountId,
            this._props.getName(),
            this._props.getEmail(),
            this._props.getCpf(),
            undefined,
            true,
            false,
        );
        return new AccountBuilderEntity(account);
    }

    build(): AccountEntity {
        return this._props;
    }
}