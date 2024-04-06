require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routers/router.js')
const connection = require('./connection.js')

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/', router)
const port = 3001;

connection().then(() => {

    app.listen(port, () => {
        console.log('Server Connected at port', port);
    })
})




