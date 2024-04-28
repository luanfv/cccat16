import { EmailVO } from './email.vo';

describe('EmailVO', () => {
    describe('WHEN receive a invalid value', () => {
        it('SHOULD throw an error exception: "E-mail informado é inválido"', () => {
            const expectedResult = new Error('E-mail informado é inválido');
            expect(() => new EmailVO('john')).toThrowError(expectedResult);
        });
    });

    describe('WHEN call getValue', () => {
        it('SHOULD return the car plate', () => {
            const carPlate = new EmailVO('john@gmail.com');
            expect(carPlate.getValue()).toEqual('john@gmail.com');
        });
    });
});