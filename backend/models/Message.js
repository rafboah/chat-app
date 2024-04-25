const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        senderId: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
        receiverId: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
        messageType: {type:String, required:true, enum:['text', 'image', 'audio']},
        content: {type:String, required:true},
        status: {type:String, enum:['sent', 'delivered', 'read'], default:'sent'},
        timestamp: {type:Date, default:Date.now}
    }
);

const Message = mongoose.model('Message', MessageSchema);

modules.export = Message;