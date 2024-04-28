import { VO } from './vo';

export class NameVO implements VO {
    private readonly value: string;

    constructor(value: string) {
        if (!value.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Nome precisa ser completo');
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}