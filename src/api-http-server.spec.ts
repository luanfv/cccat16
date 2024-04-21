import pgp from 'pg-promise';
import request from 'supertest';
import { ApiHttpServer } from './api-http-server';
import { AccountDatabaseRepository } from './infra/repository/account-database.repository';
import { PostgresAdapter } from './infra/database/postgres.adapter';

const connection = pgp()({host: 'localhost', database: 'app', user: 'postgres', password: '123456' });
const FIND_USER_FOR_ACCOUNT_ID_SCRIPT = 'select * from cccat16.account where account_id = $1';
const DELETE_USER_FOR_ACCOUNT_ID_SCRIPT = 'delete from cccat16.account where account_id = $1';

describe('POST /signup integration tests', () => {
	const postgresAdapter = new PostgresAdapter();
	const accountRepository = new AccountDatabaseRepository(postgresAdapter);
	const api = new ApiHttpServer().addSignUpRoute(accountRepository);
	const app = api.app;

	afterAll(async () => {
		await connection.$pool.end();
		await postgresAdapter.close();
	});

	describe('WHEN can create new member', () => {
		const input = {
			name: 'John Doe',
			email: `john.doe${Math.random()}@gmail.com`,
			cpf: '87748248800',
			isPassenger: true
		};
		let output: request.Response;

		beforeAll(async () => {
			output = await request(app)
				.post('/signup')
				.send(input);
		});

		afterAll(async () => {
			await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [output.body.accountId]);
		});

		it('SHOULD create new member', async () => {
			const [memberFromDatabase] = await connection.query(FIND_USER_FOR_ACCOUNT_ID_SCRIPT, [output.body.accountId]);
			const result = {
				name: memberFromDatabase.name,
				email: memberFromDatabase.email,
				cpf: memberFromDatabase.cpf,
				isPassenger: memberFromDatabase.is_passenger,
			};
			expect(result).toEqual(input);
		});

		it('SHOULD return accountId from new member', async () => {
			expect(output.body.accountId).toEqual(expect.any(String));
		});
	});

	describe('WHEN cannot create new member', () => {
		let output: request.Response;

		beforeAll(async () => {
			const input = {
				name: 'John Doe',
				email: `john${Math.random()}@gmail.com`,
				cpf: '00',
				isDriver: true,
				carPlate: 'ABC1234',
			};
			output = await request(app)
				.post('/signup')
				.send(input);
		});

		it('SHOULD return message', () => {
			expect(output.body).toEqual({ message: 'CPF informado inválido' });
		});

		it('SHOULD return status code 422', () => {
			expect(output.status).toEqual(422);
		});
	});
});

describe('POST /ride integration tests', () => {
	describe('WHEN can create new ride', () => {

	});

	describe('WHEN cannot create new ride', () => {

	});
});
