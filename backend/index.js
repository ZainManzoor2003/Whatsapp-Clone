require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routers/router.js')
const connection = require('./connection.js')

const app = express();
app.use(bodyParser.json());
app.use(cors(
     {
        origin:["https://whatsapp-clone-frontend-tau.vercel.app","https://whatsapp-clone-frontend-tau.vercel.app/"],
        methods:["POST","GET"],
        credentials:true
    }
));
app.use('/', router)
const port = 3001;

connection().then(() => {

    app.listen(port, () => {
        console.log('Server Connected at port', port);
    })
})




