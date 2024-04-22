import crypto from 'node:crypto';
import { RideEntity } from './ride.entity';

export class RideBuilderEntity {
    private _props: RideEntity;

    constructor() {
        this._props = RideEntity.create(
            crypto.randomUUID(),
            crypto.randomInt(128),
            crypto.randomInt(128),
            crypto.randomInt(128),
            crypto.randomInt(128),
        );
    }

    withStatusCompleted() {
        this._props = { ...this._props, status: 'completed' };
        return this;
    }

    build(): RideEntity {
        return this._props;
    }
}