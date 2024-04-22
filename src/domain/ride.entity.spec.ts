import { RideBuilderEntity } from './ride-builder.entity';
import { RideEntity } from './ride.entity';

describe('RideEntity unit tests', () => {
	describe('create', () => {
		it('SHOULD return new ride with status = requested', () => {
			const ride = new RideBuilderEntity().build();
			const expectedResult: RideEntity = {
				date: expect.any(Date),
				fromLat: ride.fromLat,
				fromLong: ride.fromLong,
				passengerId: ride.passengerId,
				rideId: expect.any(String),
				status: 'requested',
				toLat: ride.toLat,
				toLong: ride.toLong,
			};
			const result = RideEntity.create(
				ride.passengerId,
				ride.fromLat,
				ride.fromLong,
				ride.toLat,
				ride.toLong,
			);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('restore', () => {
		it('SHOULD return the ride', () => {
			const ride = new RideBuilderEntity().build();
			const result = RideEntity.restore(
				ride.rideId,
				ride.passengerId,
				ride.fromLat,
				ride.fromLong,
				ride.toLat,
				ride.toLong,
				ride.status,
				ride.date,
			);
			expect(result).toEqual(ride);
		});
	});
});