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
        res.json(messages);            
    } catch (error) {
        res.status(500).send('Error retrieving messages')
    }
}