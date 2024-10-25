const mongoose =require('mongoose')
const initData = require('./data.js');
const listing = require('../models/listing.js')

main().catch(err => console.log(err)).then(()=>{
    console.log("Connected to the Databases Sucessfully")
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
const initDB = async()=>{
    await listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:"67147a51db82ab90e3c59cfb"}) )
    await listing.insertMany(initData.data);
    console.log('data was initialized')
} 
initDB();