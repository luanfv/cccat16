import { AccountMemoryDAO } from '../resource/account-memory.dao';
import { SignUpService, SignUpServiceDto } from './sign-up.service';

describe('SignUpService unit tests', () => {
    const accountDAO = new AccountMemoryDAO();
    const signUpService = new SignUpService(accountDAO);

    describe('WHEN invalid CPF', () => {
        it('SHOULD throw error with message: "CPF informado inválido"', async () => {
            const account: SignUpServiceDto = {
				name: 'John Doe',
				email: `john${Math.random()}@gmail.com`,
				cpf: '00',
				isDriver: true,
				carPlate: 'ABC1234',
			};
            const expectedResult = new Error('CPF informado inválido');
            await expect(signUpService.execute(account))
                .rejects
                .toThrowError(expectedResult);
        });
    });

    describe('WHEN invalid email', () => {
        it('SHOULD throw error with message: "E-mail informado é inválido"', async () => {
            const account: SignUpServiceDto = {
				name: 'John Doe',
				email: `john${Math.random()}`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'ABC1234',
			};
            const expectedResult = new Error('E-mail informado é inválido');
            await expect(signUpService.execute(account))
                .rejects
                .toThrowError(expectedResult);
        });
    });

    describe('WHEN invalid full name', () => {
        it('SHOULD throw error with message: "Nome precisa ser completo"', async () => {
            const account: SignUpServiceDto = {
				name: 'John',
				email: `john${Math.random()}@gmail.com`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'ABC1234',
			};
            const expectedResult = new Error('Nome precisa ser completo');
            await expect(signUpService.execute(account))
                .rejects
                .toThrowError(expectedResult);
        });
    });

    describe('WHEN invalid car plate', () => {
        it('SHOULD throw error with message: "Placa do carro inválida"', async () => {
            const account: SignUpServiceDto = {
				name: 'John Doe',
				email: `john${Math.random()}@gmail.com`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: '0',
			};
            const expectedResult = new Error('Placa do carro inválida');
            await expect(signUpService.execute(account))
                .rejects
                .toThrowError(expectedResult);
        });
    });

    describe('WHEN user already exists', () => {
        it('SHOULD throw error with message: "Usuário já cadastrado"', async () => {
            const account: SignUpServiceDto = {
				name: 'John Doe',
				email: `john${Math.random()}@gmail.com`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'ABC1234',
			};
            accountDAO.saveAccount(account)
            const expectedResult = new Error('Usuário já cadastrado');
            await expect(signUpService.execute(account))
                .rejects
                .toThrowError(expectedResult);
        });
    });

    describe('WHEN register driver', () => {
        it('SHOULD create new driver', async () => {
            const account: SignUpServiceDto = {
				name: 'John Doe',
				email: `john${Math.random()}@gmail.com`,
				cpf: '97456321558',
				isDriver: true,
				carPlate: 'ABC1234',
			};
            const accountId = await signUpService.execute(account);
            const expectedResult = await accountDAO.getAccountByEmail(account.email);
            const result = {
                ...account,
                accountId,
                isPassenger: false,
            };
            expect(result).toEqual(expectedResult);
        });
    });

    describe('WHEN register passenger', () => {
        it('SHOULD create new passenger', async () => {
            const account: SignUpServiceDto = {
				name: 'John Doe',
				email: `john${Math.random()}@gmail.com`,
				cpf: '97456321558',
                isPassenger: true,
			};
            const accountId = await signUpService.execute(account);
            const expectedResult = await accountDAO.getAccountByEmail(account.email);
            const result = {
                ...account,
                accountId,
                isDriver: false,
                carPlate: undefined,
            };
            expect(result).toEqual(expectedResult);
        });
    });
});