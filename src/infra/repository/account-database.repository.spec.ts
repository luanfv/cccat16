import pgPromise from 'pg-promise';
import { AccountBuilderEntity } from '../../domain/account-builder.entity';
import { AccountDatabaseRepository } from './account-database.repository';
import { AccountEntity } from '../../domain/account.entity';

const connection = pgPromise()({host: 'localhost', database: 'app', user: 'postgres', password: '123456' });
const FIND_USER_FOR_ACCOUNT_ID_SCRIPT = 'select * from cccat16.account where account_id = $1';
const DELETE_USER_FOR_ACCOUNT_ID_SCRIPT = 'delete from cccat16.account where account_id = $1';

describe('AccountDatabaseRepository integration tests', () => {
    const accountDatabaseRepository = new AccountDatabaseRepository();
    const account = new AccountBuilderEntity().build();

    beforeAll(async () => {
        await connection.query(
			'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)', 
			[account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver],
		);
    });

    afterAll(async () => {
        await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [account.accountId]);
        await connection.$pool.end();
        await accountDatabaseRepository.close();
    });

    describe('getAccountByEmail', () => {
        it('SHOULD return the member from database', async () => {
            await expect(accountDatabaseRepository.getAccountByEmail(account.email))
                .resolves
                .toEqual(account);
        });

    });

    describe('getAccountById', () => {
        it('SHOULD return the member from database', async () => {
            await expect(accountDatabaseRepository.getAccountById(account.accountId))
                .resolves
                .toEqual(account);
        });

    });

    describe('saveAccount', () => {
        it('SHOULD save the member from database', async () => {
            const newAccount = new AccountBuilderEntity().build();
            await accountDatabaseRepository.saveAccount(newAccount);
            const [memberFromDatabase] = await connection.query(FIND_USER_FOR_ACCOUNT_ID_SCRIPT, [newAccount.accountId]);
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
            await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [account.accountId]);
        });
    });
});