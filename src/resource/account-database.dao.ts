import pgPromise from 'pg-promise';
import { AccountDAO } from './account-dao';

// Driven/Resource Adapter
export class AccountDatabaseDAO implements AccountDAO {
	constructor(private readonly connection = pgPromise()('postgres://postgres:123456@localhost:5432/app')) {}

	async getAccountByEmail (email: string) {
		const [acc] = await this.connection.query('select * from cccat16.account where email = $1', [email]);
		return acc;
	}
	
	async getAccountById (accountId: string) {
		const [acc] = await this.connection.query('select * from cccat16.account where account_id = $1', [accountId]);
		return acc;
	}
	
	async saveAccount (account: any) {
		await this.connection.query(
			'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)', 
			[account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver],
		);
	}
}