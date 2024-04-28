import { RideEntity } from '../../domain/entity/ride.entity';
import { RideRepository } from './ride.repository';

export class RideMemoryRepository implements RideRepository {
    private rides: RideEntity[];

	constructor () {
		this.rides = [];
	}

    async saveRide(ride: RideEntity): Promise<void> {
        this.rides.push(ride);
    }

    async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
		const ride = this.rides.find((ride) => ride.passengerId === passengerId);
		return !!ride;
    }

    async getRideById(rideId: string): Promise<RideEntity | undefined> {
		const ride = this.rides.find((ride) => ride.rideId === rideId);
		return ride;
    }

}