import axios, { AxiosResponse } from 'axios';
import pgp from 'pg-promise';

axios.defaults.validateStatus = function () {
	return true;
}
const connection = pgp()({host: 'localhost', database: 'app', user: 'postgres', password: '123456' });
const API_URL = 'http://localhost:3000/signup';
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
		let output: AxiosResponse<any, any>;

		beforeAll(async () => {
			output = await axios.post(API_URL, input);
		});

		afterAll(async () => {
			await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [output.data.accountId]);
		});

		it('SHOULD create new member', async () => {
			const [memberFromDatabase] = await connection.query(FIND_USER_FOR_ACCOUNT_ID_SCRIPT, [output.data.accountId]);
			const result = {
				name: memberFromDatabase.name,
				email: memberFromDatabase.email,
				cpf: memberFromDatabase.cpf,
				isPassenger: memberFromDatabase.is_passenger,
			};
			expect(result).toEqual(input);
		});

		it('SHOULD return accountId from new member', async () => {
			expect(output.data.accountId).toEqual(expect.any(String));
		});
	});

	describe('WHEN unavailable to create new member', () => {
		let output: AxiosResponse<any, any>;

		beforeAll(async () => {
			const input = {
				name: 'John Doe',
				email: `john${Math.random()}@gmail.com`,
				cpf: '00',
				isDriver: true,
				carPlate: 'ABC1234',
			};
			output = await axios.post(API_URL, input);
		});

		it('SHOULD return message', () => {
			expect(output.data).toEqual({ message: 'CPF informado inválido' });
		});

		it('SHOULD return status code 422', () => {
			expect(output.status).toEqual(422);
		});
	});
});
