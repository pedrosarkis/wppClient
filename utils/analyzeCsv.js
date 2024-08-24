const fs = require("fs");
const HEADER = require('../constants/HEADER')
const csvParser = require('csv-parser')
const blackListExtension = ['txt', 'csv', 'jfif']


const analyzeCsv = (path) => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(csvParser({
                mapHeaders: ({ header }) => header.trim()
            }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', reject);
    });
};

const getMediaFromPath = (path) => {
    const folder = fs.readdirSync(path).filter(f => blackListExtension.indexOf(f.split('.').pop()) === -1)
    return folder
}

// 5548988495570 ok
// 554888495570

// 48988495570
// 4888495570


//validate phone number according to brazilian phone number, which might have 10 or 11 digits, don't check only the length 
const formatPhoneNumber = (plainNumber) => {
    let secondaryNumber = plainNumber
    if(!plainNumber.startsWith('55')) {
        plainNumber =  `55${plainNumber}`
    }

    if(plainNumber.toString().slice(4, plainNumber.length).length === 9) {
        secondaryNumber = plainNumber.toString().slice(0, 4) + plainNumber.toString().slice(5, plainNumber.length)
    }

    if(plainNumber.toString().slice(4, plainNumber.length).length === 8) {
        secondaryNumber = plainNumber.toString().slice(0, 4) + '9' + plainNumber.toString().slice(4, plainNumber.length)
    }

    if(plainNumber.length > 13 || plainNumber.length < 12 ) {
        throw new Error('Invalid phone number')
    }
    return {
        plainNumber,
        secondaryNumber
    }
}

module.exports = {
    analyzeCsv,
    formatPhoneNumber,
    getMediaFromPath
}