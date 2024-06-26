import { AccountMemoryRepository } from '../infra/repository/account-memory.repository';
import { RequestRideService } from './request-ride.service';
import { RideMemoryRepository } from '../infra/repository/ride-memory.repository';
import { RideBuilderEntity } from '../domain/entity/ride-builder.entity';
import { AccountBuilderEntity } from '../domain/entity/account-builder.entity';
import { RideEntity } from '../domain/entity/ride.entity';

describe('RequestRideService unit tests', () => {
	const accountRepository = new AccountMemoryRepository();
	const rideRepository = new RideMemoryRepository();
	const requestRideService = new RequestRideService(
		accountRepository,
		rideRepository,
	);

	it('SHOULD create new ride', async () => {
		const account = new AccountBuilderEntity().withPassenger().build();
		accountRepository.saveAccount(account);
		const rideObject = new RideBuilderEntity().withPassenger(account.accountId).build().toObject();
		const rideId = await requestRideService.execute({
			fromLat: rideObject.fromLat,
			fromLong: rideObject.fromLong,
			passengerId: rideObject.passengerId,
			toLat: rideObject.toLat,
			toLong: rideObject.toLong,
		});
		const expectedResult = RideEntity.restore(
			rideId,
			rideObject.passengerId,
			rideObject.driverId,
			rideObject.fromLat,
			rideObject.fromLong,
			rideObject.toLat,
			rideObject.toLong,
			rideObject.status,
			expect.any(Date),
		);
		await expect(rideRepository.getRideById(rideId))
			.resolves
			.toEqual(expectedResult);
	});

	it('SHOULD return ride id', async () => {
		const account = new AccountBuilderEntity().withPassenger().build();
		accountRepository.saveAccount(account);
		const ride = new RideBuilderEntity().withPassenger(account.accountId).build().toObject();
		await expect(requestRideService.execute({
				fromLat: ride.fromLat,
				fromLong: ride.fromLong,
				passengerId: ride.passengerId,
				toLat: ride.toLat,
				toLong: ride.toLong,
			}))
			.resolves
			.toEqual(expect.any(String));
	});

	describe('WHEN account does not found', () => {
		it('SHOULD throw error with message: "Conta não encontrada"', async () => {
			const ride = new RideBuilderEntity().build().toObject();
			const expectedResult = new Error('Conta não encontrada');
			await expect(requestRideService.execute({
					fromLat: ride.fromLat,
					fromLong: ride.fromLong,
					passengerId: ride.passengerId,
					toLat: ride.toLat,
					toLong: ride.toLong,
				}))
				.rejects
				.toThrowError(expectedResult);
		});
	});

	describe('WHEN account is not passenger', () => {
		it('SHOULD throw error with message: "Conta não é de um passageiro"', async () => {
			const account = new AccountBuilderEntity().build();
			accountRepository.saveAccount(account);
			const ride = new RideBuilderEntity().withPassenger(account.accountId).build().toObject();
			const expectedResult = new Error('Conta não é de um passageiro');
			await expect(requestRideService.execute({
					fromLat: ride.fromLat,
					fromLong: ride.fromLong,
					passengerId: ride.passengerId,
					toLat: ride.toLat,
					toLong: ride.toLong,
				}))
				.rejects
				.toThrowError(expectedResult);
		});
	});

	describe('WHEN account has active in other ride', () => {
		it('SHOULD throw error with message: "Passageiro já esta em uma corrida"', async () => {
			const account = new AccountBuilderEntity().withPassenger().build();
			accountRepository.saveAccount(account);
			const rideObject = new RideBuilderEntity().withPassenger(account.accountId).build().toObject();
			const ride = RideEntity.restore(
				rideObject.rideId,
				rideObject.passengerId,
				rideObject.driverId,
				rideObject.fromLat,
				rideObject.fromLong,
				rideObject.toLat,
				rideObject.toLong,
				rideObject.status,
				rideObject.date,
			);
			rideRepository.saveRide(ride);
			const expectedResult = new Error('Passageiro já esta em uma corrida');
			await expect(requestRideService.execute({
					fromLat: rideObject.fromLat,
					fromLong: rideObject.fromLong,
					passengerId: rideObject.passengerId,
					toLat: rideObject.toLat,
					toLong: rideObject.toLong,
				}))
				.rejects
				.toThrowError(expectedResult);
		});
	});
});
