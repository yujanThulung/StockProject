import mongoose from 'mongoose';

const overviewSchema = new mongoose.Schema({
    symbol:{
        type:String,
        unique:true,
    },
    data:{
        type:Object,
        required:true,
    },
    lastUpdated:{
        type:Date,
        default:Date.now,
    }
})


export default mongoose.model('Overview', overviewSchema);