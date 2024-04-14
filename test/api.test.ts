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

	it('SHOULD create new passenger', async function () {
		const input = {
			name: 'John Doe',
			email: `john.doe${Math.random()}@gmail.com`,
			cpf: '87748248800',
			isPassenger: true
		};
		const output = await axios.post(API_URL, input);
		const [memberFromDatabase] = await connection.query(FIND_USER_FOR_ACCOUNT_ID_SCRIPT, [output.data.accountId]);
		const result = {
			name: memberFromDatabase.name,
			email: memberFromDatabase.email,
			cpf: memberFromDatabase.cpf,
			isPassenger: memberFromDatabase.is_passenger,
		};
		expect(result).toEqual(input);
		await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [output.data.accountId]);
	});
	
	it('SHOULD create new driver', async function () {
		const input = {
			name: 'John Doe',
			email: `john.doe${Math.random()}@gmail.com`,
			cpf: '97456321558',
			isDriver: true,
			carPlate: 'ABC1234',
		};
		const output = await axios.post(API_URL, input);
		const [memberFromDatabase] = await connection.query(FIND_USER_FOR_ACCOUNT_ID_SCRIPT, [output.data.accountId]);
		const result = {
			name: memberFromDatabase.name,
			email: memberFromDatabase.email,
			cpf: memberFromDatabase.cpf,
			isDriver: memberFromDatabase.is_driver,
			carPlate: memberFromDatabase.car_plate,
		};
		expect(result).toEqual(input);
		await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [output.data.accountId]);
	});

	describe('WHEN receive email already exists', () => {
		let firstOutput: AxiosResponse<any, any>;
		let secondOutput: AxiosResponse<any, any>;

		beforeAll(async () => {
			const input = {
				name: 'John Doe',
				email: `john.doe${Math.random()}@gmail.com`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'ABC1234',
			};
			firstOutput = await axios.post(API_URL, input);
			secondOutput = await axios.post(API_URL, input);
		});

		afterAll(async () => {
			await connection.query(DELETE_USER_FOR_ACCOUNT_ID_SCRIPT, [firstOutput.data.accountId]);
		})

		it('SHOULD return "Usuário já cadastrado"', () => {
			expect(secondOutput.data).toEqual({ message: 'Usuário já cadastrado' });
		});

		it('SHOULD return status code 422', () => {
			expect(secondOutput.status).toEqual(422);
		});
	});

	describe('WHEN do not receive full name', () => {
		let output: AxiosResponse<any, any>;

		beforeAll(async () => {
			const input = {
				name: 'John',
				email: `john${Math.random()}@gmail.com`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'ABC1234',
			};
			output = await axios.post(API_URL, input);
		});

		it('SHOULD return "Nome precisa ser completo"', () => {
			expect(output.data).toEqual({ message: 'Nome precisa ser completo'});
		});

		it('SHOULD return status code 422', () => {
			expect(output.status).toEqual(422);
		});
	});

	describe('WHEN receive invalid email', () => {
		let output: AxiosResponse<any, any>;

		beforeAll(async () => {
			const input = {
				name: 'John Doe',
				email: `john${Math.random()}`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'ABC1234',
			};
			output = await axios.post(API_URL, input);
		});

		it('SHOULD return "E-mail informado é inválido"', () => {
			expect(output.data).toEqual({ message: 'E-mail informado é inválido' });
		});

		it('SHOULD return status code 422', () => {
			expect(output.status).toEqual(422);
		});
	});

	describe('WHEN receive invalid cpf', () => {
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

		it('SHOULD return "CPF informado inválido"', () => {
			expect(output.data).toEqual({ message: 'CPF informado inválido' });
		});

		it('SHOULD return status code 422', () => {
			expect(output.status).toEqual(422);
		});
	});

	describe('WHEN receive invalid car plate', () => {
		let output: AxiosResponse<any, any>;

		beforeAll(async () => {
			const input = {
				name: 'John Doe',
				email: `john.doe${Math.random()}@gmail.com`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'jkl',
			};
			output = await axios.post(API_URL, input);
		});

		it('SHOULD return "Placa do carro inválida"', () => {
			expect(output.data).toEqual({ message: 'Placa do carro inválida' });
		});

		it('SHOULD return status code 422', () => {
			expect(output.status).toEqual(422);
		});
	});
});
