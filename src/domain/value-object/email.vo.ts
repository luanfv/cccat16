import { VO } from './vo';

export class EmailVO implements VO {
    private readonly value: string;

    constructor(value: string) {
        if (!value.match(/^(.+)@(.+)$/)) throw new Error('E-mail informado é inválido');
        this.value = value;
    }
    
    getValue() {
        return this.value;
    }
}