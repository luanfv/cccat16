import { AccountBuilderEntity } from './account-builder.entity';
import { AccountEntity } from './account.entity';

describe('AccountEntity unit tests', () => {
	describe('WHEN cannot create', () => {
		it.each`
			account 																| expectedMessage
			${{ ...new AccountBuilderEntity().build().toObject(), cpf: '0' }}		| ${'CPF informado inválido'}
			${{ ...new AccountBuilderEntity().build().toObject(), email: 'john' }}	| ${'E-mail informado é inválido'}
			${{ ...new AccountBuilderEntity().build().toObject(), name: 'john' }}	| ${'Nome precisa ser completo'}
			${{ ...new AccountBuilderEntity().build().toObject(), carPlate: '0' }}	| ${'Placa do carro inválida'}
		`('SHOULD throw error with message: $expectedMessage', ({ account, expectedMessage }) => {
			const expectedResult = new Error(expectedMessage);
			expect(() => AccountEntity.create(
				account.name,
				account.email,
				account.cpf,
				account.carPlate,
				account.isPassenger,
				account.isDriver,
			)).toThrowError(expectedResult);			
		});
	});

	describe('WHEN cannot restore', () => {
		it.each`
			account 																| expectedMessage
			${{ ...new AccountBuilderEntity().build().toObject(), cpf: '0' }}		| ${'CPF informado inválido'}
			${{ ...new AccountBuilderEntity().build().toObject(), email: 'john' }}	| ${'E-mail informado é inválido'}
			${{ ...new AccountBuilderEntity().build().toObject(), name: 'john' }}	| ${'Nome precisa ser completo'}
			${{ ...new AccountBuilderEntity().build().toObject(), carPlate: '0' }}	| ${'Placa do carro inválida'}
		`('SHOULD throw error with message: $expectedMessage', ({ account, expectedMessage }) => {
			const expectedResult = new Error(expectedMessage);
			expect(() => AccountEntity.restore(
				account.id,
				account.name,
				account.email,
				account.cpf,
				account.carPlate,
				account.isPassenger,
				account.isDriver,
			)).toThrowError(expectedResult);			
		});
	});

	describe('WHEN can create', () => {
		it('SHOULD return the account', () => {
			const account = new AccountBuilderEntity().build();
			const expectedResult = { ...account, accountId: expect.any(String) };
			expect(AccountEntity.create(
				account.getName(),
				account.getEmail(),
				account.getCpf(),
				account.getCarPlate(),
				account.isPassenger,
				account.isDriver,
			)).toEqual(expectedResult);
		});
	});

	describe('WHEN can restore', () => {
		it('SHOULD return the account', () => {
			const account = new AccountBuilderEntity().build();
			expect(AccountEntity.restore(
				account.accountId,
				account.getName(),
				account.getEmail(),
				account.getCpf(),
				account.getCarPlate(),
				account.isPassenger,
				account.isDriver,
			)).toEqual(account);
		});
	});
});