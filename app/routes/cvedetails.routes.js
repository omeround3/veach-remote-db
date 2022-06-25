module.exports = (app) => {
    const cvedetails = require('../controllers/cvedetails.js');
    app.get('/cvedetails/:cveid', cvedetails.findOne);
}
