import { AccountBuilderEntity } from '../../domain/entity/account-builder.entity';
import { AccountDatabaseRepository } from './account-database.repository';
import { AccountEntity } from '../../domain/entity/account.entity';
import { PostgresAdapter } from '../database/postgres.adapter';

const FIND_USER_FOR_ACCOUNT_ID_SCRIPT = 'select * from cccat16.account where account_id = $1';
const DELETE_USER_FOR_ACCOUNT_ID_SCRIPT = 'delete from cccat16.account where account_id = $1';

describe('AccountDatabaseRepository integration tests', () => {
    const postgresAdapter = new PostgresAdapter();
    const accountDatabaseRepository = new AccountDatabaseRepository(postgresAdapter);
    const account = new AccountBuilderEntity().build();

    beforeAll(async () => {
        await postgresAdapter.query(
			'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)', 
			[account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver],
		);
    });

    afterAll(async () => {
        await postgresAdapter.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [account.accountId]);
        await postgresAdapter.close();
    });

    describe('getAccountByEmail', () => {
        it('SHOULD return the account from database', async () => {
            await expect(accountDatabaseRepository.getAccountByEmail(account.getEmail()))
                .resolves
                .toEqual(account);
        });

    });

    describe('getAccountById', () => {
        it('SHOULD return the account from database', async () => {
            await expect(accountDatabaseRepository.getAccountById(account.accountId))
                .resolves
                .toEqual(account);
        });

    });

    describe('saveAccount', () => {
        it('SHOULD save the account in database', async () => {
            const newAccount = new AccountBuilderEntity().build();
            await accountDatabaseRepository.saveAccount(newAccount);
            const [memberFromDatabase] = await postgresAdapter.query(FIND_USER_FOR_ACCOUNT_ID_SCRIPT, [newAccount.accountId]);
            const result = AccountEntity.restore(
                memberFromDatabase.account_id,
                memberFromDatabase.name,
                memberFromDatabase.email,
                memberFromDatabase.cpf,
                memberFromDatabase.car_plate,
                memberFromDatabase.is_passenger,
                memberFromDatabase.is_driver,
            );
            expect(result).toEqual(newAccount);
            await postgresAdapter.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [account.accountId]);
        });
    });
});