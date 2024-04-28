import { RideEntity } from '../../domain/entity/ride.entity';

export interface RideRepository {
	saveRide (ride: RideEntity): Promise<void>;
	hasActiveRideByPassengerId (passengerId: string): Promise<boolean>;
	getRideById (rideId: string): Promise<RideEntity | undefined>;
}