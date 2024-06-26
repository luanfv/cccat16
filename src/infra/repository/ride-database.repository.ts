import { RideEntity } from '../../domain/entity/ride.entity';
import { PostgresAdapter } from '../database/postgres.adapter';
import { RideRepository } from './ride.repository';

export class RideDatabaseRepository implements RideRepository {
    constructor(private readonly database: PostgresAdapter) {}

	async saveRide(ride: RideEntity): Promise<void> {
		const rideObject = ride.toObject();
		await this.database.query(
			'insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
			[
				rideObject.rideId,
				rideObject.passengerId,
				rideObject.fromLat,
				rideObject.fromLong,
				rideObject.toLat,
				rideObject.toLong,
				rideObject.status,
				rideObject.date,
			],
		);
	}

	async getRideById(rideId: string): Promise<RideEntity | undefined> {
		const [rideData] = await this.database.query('select * from cccat16.ride where ride_id = $1', [rideId]);
		if (!rideData) return undefined;
		return RideEntity.restore(rideData.ride_id, rideData.passenger_id, rideData.driver_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date);
	}

	async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
		const [rideData] = await this.database.query("select * from cccat16.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
		return !!rideData;
	}
}