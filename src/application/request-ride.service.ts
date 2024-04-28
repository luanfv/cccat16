import { RideEntity } from '../domain/entity/ride.entity';
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
	constructor (
		private readonly accountRepository: AccountRepository,
		private readonly rideRepository: RideRepository,
	) {}
	
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