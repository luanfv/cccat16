import { RideEntity } from '../domain/ride.entity';
import { RideRepository } from '../infra/repository/ride.repository';
import { AccountRepository } from '../infra/repository/account.repository';

export type RequestRideServiceDto = {
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
};

export class RequestRideService {
	constructor (readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}
	
	async execute (input: RequestRideServiceDto): Promise<string> {
		const account = await this.accountRepository.getAccountById(input.passengerId);
		if (!account) throw new Error('Conta não encontrada');
		if (!account.isPassenger) throw new Error('Conta não é de um passageiro');
		const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
		if (hasActiveRide) throw new Error('Passageiro já esta em uma corrida');
		const ride = RideEntity.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
		await this.rideRepository.saveRide(ride);
		return ride.rideId;
	}
}

describe('RequestRideService unit tests', () => {
	describe('WHEN account does not found', () => {
		it.todo('SHOULD throw error with message: "Conta não encontrada"');
	});

	describe('WHEN account is not passenger', () => {
		it.todo('SHOULD throw error with message: "Conta não é de um passageiro"');
	});

	describe('WHEN account has active in other ride', () => {
		it.todo('SHOULD throw error with message: "Passageiro já esta em uma corrida"');
	});

	it.todo('SHOULD create new ride');

	it.todo('SHOULD return ride id');
});
