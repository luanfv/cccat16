import crypto from 'node:crypto';

export class RideEntity {
	private constructor(readonly rideId: string, readonly passengerId: string, readonly fromLat: number, readonly fromLong: number, readonly toLat: number, readonly toLong: number, readonly status: string, readonly date: Date) {}

	static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number): RideEntity {
		const rideId = crypto.randomUUID();
		const status = 'requested';
		const date = new Date();
		return new RideEntity(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
	}

	static restore(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date): RideEntity {
		return new RideEntity(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
	}
}