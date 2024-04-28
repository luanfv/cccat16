import crypto from 'node:crypto';
import SegmentVO from '../value-object/segment.vo';
import { CoordVO } from '../value-object/coord.vo';
import RideStatus, { RideStatusFactory } from '../value-object/ride-status.vo';

export class RideEntity {
	status: RideStatus;

	private constructor (readonly rideId: string, readonly passengerId: string, public driverId: string, private segment: SegmentVO, status: string, readonly date: Date) {
		this.status = RideStatusFactory.create(this, status);
	}

	static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const status = 'requested';
		const date = new Date();
		return new RideEntity(rideId, passengerId, '', new SegmentVO(new CoordVO(fromLat, fromLong), new CoordVO(toLat, toLong)), status, date);
	}

	static restore(rideId: string, passengerId: string, driverId: string | undefined, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date) {
		return new RideEntity(rideId, passengerId, driverId ?? '', new SegmentVO(new CoordVO(fromLat, fromLong), new CoordVO(toLat, toLong)), status, date);
	}

	accept(driverId: string) {
		this.status.accept();
		this.driverId = driverId;
	}

	start() {
		this.status.start();
	}

	getFromLat() {
		return this.segment.from.getLat();
	}

	getFromLong() {
		return this.segment.from.getLong();
	}

	getToLat() {
		return this.segment.to.getLat();
	}

	getToLong() {
		return this.segment.to.getLong();
	}

	getDistance() {
		return this.segment.getDistance();
	}

	getStatus() {
		return this.status.value;
	}

	toObject() {
		return {
			rideId: this.rideId,
			passengerId: this.passengerId,
			driverId: this.driverId,
			status: this.getStatus(),
			date: this.date,
			fromLong: this.getFromLong(),
			fromLat: this.getFromLat(),
			toLong: this.getToLong(),
			toLat: this.getToLat(),
		};
	}
}