import { RideBuilderEntity } from './ride-builder.entity';
import { RideEntity } from './ride.entity';

describe('RideEntity unit tests', () => {
	describe('create', () => {
		it('SHOULD return new ride with status = requested', () => {
			const ride = new RideBuilderEntity().build();
			const expectedResult = RideEntity.restore(
				expect.any(String),
				ride.passengerId,
				expect.any(String),
				ride.getFromLat(),
				ride.getFromLong(),
				ride.getToLat(),
				ride.getToLong(),
				ride.getStatus(),
				expect.any(Date),
			);
			const result = RideEntity.create(
				ride.passengerId,
				ride.getFromLat(),
				ride.getFromLong(),
				ride.getToLat(),
				ride.getToLong(),
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
				ride.driverId,
				ride.getFromLat(),
				ride.getFromLong(),
				ride.getToLat(),
				ride.getToLong(),
				ride.getStatus(),
				ride.date,
			);
			expect(result).toEqual(ride);
		});
	});
});