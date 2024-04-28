import { VO } from './vo';

export class CpfVO implements VO {
    private readonly value: string;
    private readonly FACTOR_FIRST_DIGIT = 10;
    private readonly FACTOR_SECOND_DIGIT = 11;

    constructor(value: string) {
        if (!this.validateCpf(value)) throw new Error('CPF informado inválido');
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    private validateCpf (rawCpf: string) {
        if (!rawCpf) return false;
        const cpf = this.removeNonDigits(rawCpf);
        if (!this.isValidLength(cpf)) return false;
        if (this.allDigitsEqual(cpf)) return false;
        const firstDigit = this.calculateDigit(cpf, this.FACTOR_FIRST_DIGIT);
        const secondDigit = this.calculateDigit(cpf, this.FACTOR_SECOND_DIGIT);
        return this.extractDigit(cpf) === `${firstDigit}${secondDigit}`;
    }
    
    private removeNonDigits (cpf: string) {
        return cpf.replace(/\D/g,'');
    }
    
    private isValidLength (cpf: string) {
        return cpf.length === 11;
    }
    
    private allDigitsEqual (cpf: string) {
        const [firstDigit] = cpf;
        return cpf.split('').every(digit => digit === firstDigit);
    }
    
    private calculateDigit (cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const remainder = total%11;
        return (remainder < 2) ? 0 : 11 - remainder;
    }
    
    private extractDigit (cpf: string) {
        return cpf.slice(9);
    }
}
