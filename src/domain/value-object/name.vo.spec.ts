import { NameVO } from './name.vo';

describe('NameVO', () => {
    describe('WHEN receive a invalid value', () => {
        it('SHOULD throw an error exception: "Nome precisa ser completo"', () => {
            const expectedResult = new Error('Nome precisa ser completo');
            expect(() => new NameVO('john')).toThrowError(expectedResult);
        });
    });

    describe('WHEN call getValue', () => {
        it('SHOULD return the car plate', () => {
            const carPlate = new NameVO('John Doe');
            expect(carPlate.getValue()).toEqual('John Doe');
        });
    });
});