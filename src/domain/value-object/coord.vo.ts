import { VO } from './vo';

export class CoordVO implements VO {
    private lat: number;
    private long: number;

    constructor (lat: number, long: number) {
        if (lat < -90 || lat > 90) throw new Error('Latitude inválida');
        if (long < -180 || long > 180) throw new Error('Longitude inválida');
        this.lat = lat;
        this.long = long;
    }

    getValue() {
        return {
            lat: this.lat,
            long: this.long,
        };
    }

    getLat() {
        return this.lat;
    }

    getLong() {
        return this.long;
    }
}