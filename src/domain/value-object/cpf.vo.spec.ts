import { CpfVO } from './cpf.vo';

describe('CpfVO', () => {
    describe.each([
        '11111111111',
        '123',
        '1234566789123456789',
        '',
    ])('WHEN receive a invalid value: %s', (invalidCpf) => {
        it('SHOULD throw an error exception: "CPF informado inválido"', () => {
            const expectedResult = new Error('CPF informado inválido');
            expect(() => new CpfVO(invalidCpf)).toThrowError(expectedResult);
        });
    });

    describe.each([
        '97456321558',
        '71428793860',
        '87748248800',
    ])('WHEN call getValue: %s', function (cpf) {
        it('SHOULD return the car plate', () => {
            const carPlate = new CpfVO(cpf);
            expect(carPlate.getValue()).toEqual(cpf);
        });
    });
});




