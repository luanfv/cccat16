// Driven/Resource Port
export interface AccountDAO {
	getAccountByEmail (email: string): Promise<any>;
	getAccountById (accountId: string): Promise<any>;
	saveAccount (account: {
		accountId: string;
		name: string;
		email: string;
		cpf: string;
		carPlate?: string;
		isPassenger: boolean;
		isDriver: boolean;
	}): Promise<void>;
}
