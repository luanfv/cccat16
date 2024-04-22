import { RideBuilderEntity } from '../../domain/ride-builder.entity';
import { PostgresAdapter } from '../database/postgres.adapter';
import { RideDatabaseRepository } from './ride-database.repository';

describe('RideDatabaseRepository integration tests', () => {
    const postgresAdapter = new PostgresAdapter();
	const rideDatabaseRepository = new RideDatabaseRepository(postgresAdapter);

	afterAll(async () => {
		await postgresAdapter.close();
	});

	describe('saveRide', () => {
		it('SHOULD save the account in database', async () => {
			const ride = new RideBuilderEntity().build();
			await rideDatabaseRepository.saveRide(ride);
			const [rideFromDatabase] = await postgresAdapter.query('select * from cccat16.ride where ride_id = $1', [ride.rideId]);
			expect(rideFromDatabase.ride_id).toEqual(ride.rideId);
			await postgresAdapter.query('delete from cccat16.ride where ride_id = $1', [ride.rideId]);
		});
	});

	describe('getRideById', () => {
		it('SHOULD return the account from database', async () => {
			const ride = new RideBuilderEntity().build();
			await postgresAdapter.query('insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)', 
				[
					ride.rideId,
					ride.passengerId,
					ride.fromLat,
					ride.fromLong,
					ride.toLat,
					ride.toLong,
					ride.status,
					ride.date,
				],
			);
			const rideFromDatabase = await rideDatabaseRepository.getRideById(ride.rideId);
			expect(rideFromDatabase).toEqual(ride);
			await postgresAdapter.query('delete from cccat16.ride where ride_id = $1', [ride.rideId]);
		});
	});

	describe('hasActiveRideByPassengerId', () => {
		describe('WHEN account has a active ride', () => {
			it('SHOULD return true', async () => {
				const ride = new RideBuilderEntity().build();
				await postgresAdapter.query('insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)', 
					[
						ride.rideId,
						ride.passengerId,
						ride.fromLat,
						ride.fromLong,
						ride.toLat,
						ride.toLong,
						ride.status,
						ride.date,
					],
				);
				const rideHasActive = await rideDatabaseRepository.hasActiveRideByPassengerId(ride.passengerId);
				expect(rideHasActive).toEqual(true);
				await postgresAdapter.query('delete from cccat16.ride where ride_id = $1', [ride.rideId]);
			});
		});


		describe('WHEN account has not a active ride', () => {
			it('SHOULD return false', async () => {
				const ride = new RideBuilderEntity().withStatusCompleted().build();
				await postgresAdapter.query('insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)', 
					[
						ride.rideId,
						ride.passengerId,
						ride.fromLat,
						ride.fromLong,
						ride.toLat,
						ride.toLong,
						ride.status,
						ride.date,
					],
				);
				const rideHasActive = await rideDatabaseRepository.hasActiveRideByPassengerId(ride.passengerId);
				expect(rideHasActive).toEqual(false);
				await postgresAdapter.query('delete from cccat16.ride where ride_id = $1', [ride.rideId]);
			});
		});
	});
});