import mongoose from 'mongoose'


const dbConnect = async () =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/zk");
        console.log("DB is connected")
        
    } catch (error) {
        console.log("Failed db")
    }
}

export default dbConnect