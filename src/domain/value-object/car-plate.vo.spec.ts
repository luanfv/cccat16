import { CarPlateVO } from './car-plate.vo';

describe('CarPlateVO', () => {
    describe('WHEN receive a invalid value', () => {
        it('SHOULD throw an error exception: "Placa do carro inválida"', () => {
            const expectedResult = new Error('Placa do carro inválida');
            expect(() => new CarPlateVO('0')).toThrowError(expectedResult);
        });
    });

    describe('WHEN call getValue', () => {
        it('SHOULD return the car plate', () => {
            const carPlate = new CarPlateVO('ABC1234');
            expect(carPlate.getValue()).toEqual('ABC1234');
        });
    });
});