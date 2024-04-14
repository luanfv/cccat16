import pgp from 'pg-promise';
import request from 'supertest';
import { app } from './api';

const connection = pgp()({host: 'localhost', database: 'app', user: 'postgres', password: '123456' });
const FIND_USER_FOR_ACCOUNT_ID_SCRIPT = 'select * from cccat16.account where account_id = $1';
const DELETE_USER_FOR_ACCOUNT_ID_SCRIPT = 'delete from cccat16.account where account_id = $1';

describe('POST /signup integration tests', () => {
	afterAll(async () => {
		await connection.$pool.end();
	});

	describe('WHEN available to create new member', () => {
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

	describe('WHEN unavailable to create new member', () => {
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
