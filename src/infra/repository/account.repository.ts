import { AccountEntity } from '../../domain/account.entity';

export interface AccountRepository {
	getAccountByEmail (email: string): Promise<AccountEntity | undefined>;
	getAccountById (accountId: string): Promise<AccountEntity | undefined>;
	saveAccount (account: AccountEntity): Promise<void>;
}
