const Message = require('../models/Message');

// Messages endpoint business logic
exports.messages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                {senderId: req.user.userId, recipientId: req.params.userId},
                {recipientId: req.user.userId, senderId: req.params.userId}
            ]
        }).sort('timestamp');

        const updatedMessages = messages.map(message => {
            if(message.messageType !== 'text')
                message.content = `${req.protocol}://${req.headers.host}${message.content}`;

                return message;
        })
        res.json(updatedMessages);            
    } catch (error) {
        res.status(500).send('Error retrieving messages');
    }
}