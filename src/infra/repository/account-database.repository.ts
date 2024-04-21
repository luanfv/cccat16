import { AccountEntity } from '../../domain/account.entity';
import { PostgresAdapter } from '../database/postgres.adapter';
import { AccountRepository } from './account.repository';

export class AccountDatabaseRepository implements AccountRepository {    
    constructor(private readonly database: PostgresAdapter) {}

    async getAccountByEmail(email: string): Promise<AccountEntity | undefined> {
        const [accountFromDatabase] = await this.database.query('select * from cccat16.account where email = $1', [email]);
		if (!accountFromDatabase) return undefined;
        return AccountEntity.restore(
            accountFromDatabase.account_id,
            accountFromDatabase.name,
            accountFromDatabase.email,
            accountFromDatabase.cpf,
            accountFromDatabase.car_plate,
            accountFromDatabase.is_passenger,
            accountFromDatabase.is_driver,
        );
    }

    async getAccountById(accountId: string): Promise<AccountEntity | undefined> {
		const [accountFromDatabase] = await this.database.query('select * from cccat16.account where account_id = $1', [accountId]);
		if (!accountFromDatabase) return undefined;
		return AccountEntity.restore(
            accountFromDatabase.account_id,
            accountFromDatabase.name,
            accountFromDatabase.email,
            accountFromDatabase.cpf,
            accountFromDatabase.car_plate,
            accountFromDatabase.is_passenger,
            accountFromDatabase.is_driver,
        );
    }

    async saveAccount(account: AccountEntity): Promise<void> {
        await this.database.query(
            'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)',
            [
                account.accountId,
                account.name,
                account.email,
                account.cpf,
                account.carPlate,
                !!account.isPassenger,
                !!account.isDriver,
            ],
        );
    }
}