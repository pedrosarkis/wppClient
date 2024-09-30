const {Client, MessageMedia, LocalAuth} = require('whatsapp-web.js')
const fs = require('fs')
const {analyzeCsv, formatPhoneNumber, getMediaFromPath} = require('./utils/analyzeCsv')
const mime = require('mime-types')

const client = new Client({
    puppeteer: {
        headless: false,
    },
    authStrategy: new LocalAuth(),
})

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr)
})

const waitTime = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time))

client.on('ready', async () => {
    console.log('Client is ready!')
    const message = fs.readFileSync('./contacts/message.txt', 'utf8')
    const contactList = await analyzeCsv('./contacts/contacts.csv')
   
    const getAllMediaFromPath = getMediaFromPath('./contacts').map(media => {
        const mediaToSend = fs.readFileSync(`./contacts/${media}`)
        return new MessageMedia(mime.lookup(media), mediaToSend.toString('base64'), media)
    })

    for (const contact of contactList) {
        const {plainNumber, secondaryNumber} = formatPhoneNumber(contact.telefone);
        const chatId = `${plainNumber}@c.us`;
        const secondaryChatId = `${secondaryNumber}@c.us`;
    
        await client.sendMessage(chatId, message);
        await client.sendMessage(secondaryChatId, message);
    
        for (const media of getAllMediaFromPath) {
            await client.sendMessage(chatId, media);
            await client.sendMessage(secondaryChatId, media);
        }
    
        await wait(waitTime[Math.floor(Math.random() * waitTime.length)]);
    }


})
client.initialize()