const mongoose = require('mongoose')

const Schema = mongoose.Schema
const QouteSchema = new Schema({
    qouteBy:[{userName:{type:String},rating:{type:Number}, id:{type:String}, qouteAmount:{type:Number}, startingDate:{type:Date}}],
    completedBy:{userName:{type:String}, id:{type:String}, qouteAmount:{type:Number}, startingDate:{type:Date}, actualAmount:{type:Number}, rating:{type:Number}},
    customerInfo:{userName:{type:String}, id:{type:String}, email:{type:String}, phone:{type:String}},
    status:{type: String, required: true},
    problem:{type: String},
    message:{type:String},
    rate:{type:Number},
    rating:{type: Number},
    isDeleted:{type:Boolean}
},{timestamps:true}
)



const Sale =mongoose.model('qoute', QouteSchema)

module.exports = Sale