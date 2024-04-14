import pgPromise from 'pg-promise';
import { randomUUID } from 'node:crypto';
import { AccountDatabaseDAO } from './account-database.dao';
import { Account } from './account.dao';

const connection = pgPromise()({host: 'localhost', database: 'app', user: 'postgres', password: '123456' });
const FIND_USER_FOR_ACCOUNT_ID_SCRIPT = 'select * from cccat16.account where account_id = $1';
const DELETE_USER_FOR_ACCOUNT_ID_SCRIPT = 'delete from cccat16.account where account_id = $1';

describe('AccountDatabaseDAO integration tests', () => {
    const accountDAO = new AccountDatabaseDAO();
    const account = new Account({
        accountId: randomUUID(),
        cpf: 'fake_cpf',
        email: 'fake_email',
        isDriver: true,
        isPassenger: false,
        name: 'fake_name fake_lastName',
        carPlate: 'ABC1234',
    });

    beforeAll(async () => {
        await connection.query(
			'insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)', 
			[account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver],
		);
    });

    afterAll(async () => {
        await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [account.accountId]);
        await connection.$pool.end();
        await accountDAO.endConnection();
    })

    describe('getAccountByEmail', () => {
        it('SHOULD return the member from database', async () => {
            await expect(accountDAO.getAccountByEmail(account.email))
                .resolves
                .toEqual(account);
        });
    });

    describe('getAccountById', () => {
        it('SHOULD return the member from database', async () => {
            await expect(accountDAO.getAccountById(account.accountId))
                .resolves
                .toEqual(account);
        });
    });

    describe('saveAccount', () => {
        it('SHOULD save the member from database', async () => {
            const newAccount = new Account({
                accountId: randomUUID(),
                cpf: 'fake_cpf 2',
                email: 'fake_email 2',
                isDriver: true,
                isPassenger: false,
                name: 'fake_name fake_lastName 2',
                carPlate: 'ABC1235',
            });
            await accountDAO.saveAccount(newAccount);
            const [memberFromDatabase] = await connection.query(FIND_USER_FOR_ACCOUNT_ID_SCRIPT, [newAccount.accountId]);
            const result = new Account({
                accountId: memberFromDatabase.account_id,
                cpf: memberFromDatabase.cpf,
                email: memberFromDatabase.email,
                isDriver: memberFromDatabase.is_driver,
                isPassenger: memberFromDatabase.is_passenger,
                name: memberFromDatabase.name,
                carPlate: memberFromDatabase.car_plate,
            });
            expect(result).toEqual(newAccount);
            await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [account.accountId]);
        });
    });
});