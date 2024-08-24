const fs = require('fs')
const { analyzeCsv, formatPhoneNumber } = require('../utils/analyzeCsv')


describe('CSV', () => {
    it('Should return the data from csv file', async () => {
       const csvAnalyzed = await analyzeCsv('./tests/mocks/contacts.csv')
        expect(csvAnalyzed).toEqual([
            { nome: 'Pedro', telefone: '5548988495570' },
            { nome: 'Marina', telefone: '4896409686' }
        ])
    })
})

describe('Phone number', () => {
    it('Should format the phone number correctly', () => {
        const phone = formatPhoneNumber('5548988495570')
        expect(phone).toEqual({
            plainNumber: '5548988495570',
            secondaryNumber: '554888495570'
        })
    })

    it('Should format the phone number correctly 2', () => {
        const phone = formatPhoneNumber('4896409686')
        expect(phone).toEqual({
            plainNumber: '554896409686',
            secondaryNumber: '5548996409686'
        })
    })

    it('Should format the phone number correctly 3 ', () => {
        const phone = formatPhoneNumber('554888495570')
        expect(phone).toEqual({
            plainNumber: '554888495570',
            secondaryNumber: '5548988495570'
        })
    })

    it('Should format the phone number correctly 4', () => {
        const phone = formatPhoneNumber('48988495570')
        expect(phone).toEqual({
            plainNumber: '5548988495570',
            secondaryNumber: '554888495570'
        })
    })

    it('Should throw error invalid phone number size', () => {
        expect(() => formatPhoneNumber('048988495570')).toThrowError('Invalid phone number')
    })
})