import { AccountBuilderEntity } from './account-builder.entity';
import { AccountEntity } from './account.entity';

describe('AccountEntity unit tests', () => {
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