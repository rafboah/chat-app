const Message = require('../models/Message');

// send message endpoint business logic
exports.sendMessage = async (req, res) => {

    let messageType = 'text';
    let messageContent = req.body.content || '';

    if(req.file){
        messageType = req.file.mimetype.startsWith('image') ? 'image' : 'audio';
        messageContent = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if(!messageContent)
        return res.status(400).send('No message content provided');

    try {
        const newMessage = new Message(
            {
                senderId: req.user.senderId,
                receiverId: req.body.receiverId,
                messageType: messageType,
                content: messageContent,
            }
        );
        await newMessage.save();
        res.status(201).json({message: 'Message sent successfully', data:newMessage});
    } catch (error) {
        console.log('Error:',error);
        res.status(500).send('Error processing file upload');   
    }
}


// fetch messages endpoint business logic
exports.fetchMessages = async (req, res) => {
    try {
        // console.log('UserId:', req.user.userId);
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
        // console.error('Error: ',error);
        res.status(500).send('Error retrieving messages');
    }
}