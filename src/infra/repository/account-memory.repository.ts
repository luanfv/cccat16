import { AccountEntity } from '../../domain/entity/account.entity';
import { AccountRepository } from './account.repository';

export class AccountMemoryRepository implements AccountRepository {
	private accounts: AccountEntity[];

	constructor () {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<AccountEntity | undefined> {
		const account = this.accounts.find((account) => account.getEmail() === email);
		if (!account) return undefined;
		return account;
	}

	async getAccountById(accountId: string): Promise<AccountEntity | undefined> {
		const account = this.accounts.find((account: any) => account.accountId === accountId);
		if (!account) return undefined;
		return account;
	}

	async saveAccount(account: AccountEntity): Promise<void> {
		this.accounts.push(account);
	}
}