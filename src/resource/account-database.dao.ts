import pgPromise from 'pg-promise';
import { Account, AccountDAO } from './account.dao';

type AccountDatabase = {
	account_id: string;
   	car_plate: string;
	cpf: string;
	email: string;
	name: string;
   	is_driver: boolean;
   	is_passenger: boolean;
}

// Driven/Resource Adapter
export class AccountDatabaseDAO implements AccountDAO {
	constructor(private readonly connection = pgPromise()('postgres://postgres:123456@localhost:5432/app')) {}

	async getAccountByEmail (email: string): Promise<Account | undefined> {
		const [account]: [AccountDatabase] = await this.connection.query('select * from cccat16.account where email = $1', [email]);
		if (!account) return undefined;
		return new Account({
			accountId: account.account_id,
			cpf: account.cpf,
			email: account.email,
			isDriver: account.is_driver,
			isPassenger: account.is_passenger,
			name: account.name,
			carPlate: account.car_plate,
		});
	}
	
	async getAccountById (accountId: string): Promise<Account | undefined> {
		const [account]: [AccountDatabase] = await this.connection.query('select * from cccat16.account where account_id = $1', [accountId]);
		if (!account) return undefined;
		return new Account({
			accountId: account.account_id,
			cpf: account.cpf,
			email: account.email,
			isDriver: account.is_driver,
			isPassenger: account.is_passenger,
			name: account.name,
			carPlate: account.car_plate,
		});
	}
	
	async saveAccount (account: Account): Promise<void> {
		await this.connection.query(
			'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)', 
			[account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver],
		);
	}

	async endConnection () {
		await this.connection.$pool.end();
	}
}