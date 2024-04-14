import { AccountDAO } from './account-dao';

// Driven/Resource Adapter
export class AccountMemoryDAO implements AccountDAO {
	accounts: any[];

	constructor () {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<any> {
		const account = this.accounts.find((account: any) => account.email === email);
		return account;
	}

	async getAccountById(accountId: string): Promise<any> {
		const account = this.accounts.find((account: any) => account.accountId === accountId);
		return account;
	}

	async saveAccount(account: any): Promise<void> {
		this.accounts.push(account);
	}
}