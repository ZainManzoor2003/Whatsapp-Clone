const mongoose=require('mongoose')
const URL=process.env.MONGOOSE_URL;

const connection = async () => {
    try {
        mongoose.connect(URL).then(() => {
            console.log('Database Connected Successfully');
        })
    } catch (error) {
        console.log('Error while connecting to the database');
    }
}

module.exports=connection;