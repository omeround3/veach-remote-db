require('dotenv').config()

const username = process.env.DB_USERNAME || ''
const password = process.env.DB_PASSWORD || ''
const host = process.env.DB_HOST || ''

module.exports = {
    url: 'mongodb+srv://' + username + ':' + password + '@' + host + '/nvdcve?retryWrites=true&w=majority'
}
