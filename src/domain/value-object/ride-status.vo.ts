import { RideEntity } from '../entity/ride.entity';

export default abstract class RideStatus {
	abstract value: string;

	constructor(readonly ride: RideEntity) {}

	abstract request(): void;
	abstract accept(): void;
	abstract start(): void;
}

export class RequestedStatus extends RideStatus {
	value: string;

	constructor(readonly ride: RideEntity) {
		super(ride);
		this.value = 'requested';
	}

	request(): void {
		throw new Error('Status inválido');
	}

	accept(): void {
		this.ride.status = new AcceptedStatus(this.ride);
	}

	start(): void {
		throw new Error('Status inválido');
	}

}

export class AcceptedStatus extends RideStatus {
	value: string;

	constructor(readonly ride: RideEntity) {
		super(ride);
		this.value = 'accepted';
	}

	request(): void {
		throw new Error('Status inválido');
	}

	accept(): void {
		throw new Error('Status inválido');
	}

	start(): void {
		this.ride.status = new InProgressStatus(this.ride);
	}

}

export class InProgressStatus extends RideStatus {
	value: string;

	constructor(readonly ride: RideEntity) {
		super(ride);
		this.value = 'in_progress';
	}

	request(): void {
		throw new Error('Status inválido');
	}

	accept(): void {
		throw new Error('Status inválido');
	}

	start(): void {
		throw new Error('Status inválido');
	}

}

export class RideStatusFactory {
	static create(ride: RideEntity, status: string) {
		if(status === 'requested') return new RequestedStatus(ride);
		if(status === 'accepted') return new AcceptedStatus(ride);
		if(status === 'in_progress') return new InProgressStatus(ride);
		throw new Error();
	}
}