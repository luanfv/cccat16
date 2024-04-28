import { AccountBuilderEntity } from '../domain/entity/account-builder.entity';
import { AccountEntity } from '../domain/entity/account.entity';
import { AccountMemoryRepository } from '../infra/repository/account-memory.repository';
import { SignUpService, SignUpServiceDto } from './sign-up.service';

describe('SignUpService unit tests', () => {
    const accountRepository = new AccountMemoryRepository();
    const signUpService = new SignUpService(accountRepository);

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

    describe('WHEN user already exists', () => {
        it('SHOULD throw error with message: "Usuário já cadastrado"', async () => {
            const account = new AccountBuilderEntity().build();
            accountRepository.saveAccount(account)
            const expectedResult = new Error('Usuário já cadastrado');
            await expect(signUpService.execute(account.toObject()))
                .rejects
                .toThrowError(expectedResult);
        });
    });

    describe('WHEN register driver', () => {
        it('SHOULD create new driver', async () => {
            const account = new AccountBuilderEntity().build().toObject();
            const accountId = await signUpService.execute(account);
            const expectedResult = await accountRepository.getAccountByEmail(account.email);
            const result = AccountEntity.restore(
                accountId,
                account.name,
                account.email,
                account.cpf,
                account?.carPlate,
                false,
                true,
            );
            expect(result).toEqual(expectedResult);
        });
    });

    describe('WHEN register passenger', () => {
        it('SHOULD create new passenger', async () => {
            const account = new AccountBuilderEntity().withPassenger().build().toObject();
            const accountId = await signUpService.execute(account);
            const expectedResult = await accountRepository.getAccountByEmail(account.email);
            const result = AccountEntity.restore(
                accountId,
                account.name,
                account.email,
                account.cpf,
                account?.carPlate,
                true,
                false,
            );
            expect(result).toEqual(expectedResult);
        });
    });

    it.todo('SHOULD return account id');
});