import crypto from 'node:crypto';
import { RideEntity } from './ride.entity';

export class RideBuilderEntity {
    private _props: RideEntity;

    constructor(ride?: RideEntity) {
        if (ride) {
            this._props = ride;
            return;
        }
        this._props = RideEntity.create(
            crypto.randomUUID(),
            crypto.randomInt(90),
            crypto.randomInt(180),
            crypto.randomInt(90),
            crypto.randomInt(180),
        );
    }

    withPassenger(passengerId: string) {
        const { date, driverId, fromLat, fromLong, rideId, status, toLat, toLong } = this._props.toObject();
        const ride = RideEntity.restore(
            rideId,
            passengerId,
            driverId,
            fromLat,
            fromLong,
            toLat,
            toLong,
            status,
            date,
        );
        return new RideBuilderEntity(ride);
    }

    build(): RideEntity {
        return this._props;
    }
}