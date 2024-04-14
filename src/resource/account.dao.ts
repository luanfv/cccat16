export class Account {
	accountId: string;
	name: string;
	email: string;
	cpf: string;
	carPlate?: string;
	isPassenger: boolean;
	isDriver: boolean;

	constructor(account: Account) {
		this.accountId = account.accountId,
		this.name = account.name;
		this.email = account.email;
		this.carPlate = account.carPlate;
		this.cpf = account.cpf;
		this.isPassenger = account.isPassenger;
		this.isDriver = account.isDriver;
	}
}

// Driven/Resource Port
export interface AccountDAO {
	getAccountByEmail (email: string): Promise<Account | undefined>;
	getAccountById (accountId: string): Promise<Account | undefined>;
	saveAccount (account: Account): Promise<void>;
}
