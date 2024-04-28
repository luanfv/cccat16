import { VO } from './vo';

export class CarPlateVO implements VO {
    private readonly value: string;
    
    constructor(value: string) {
        if (!value.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('Placa do carro inválida');
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}