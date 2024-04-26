const Message = require('../models/Message');

// File upload endpoint business logic
exports.upload = async (req, res) => {
    if(!req.file)
        return res.status(400).send('No file upload');

    let messageType = 'text';
    if(req.file.mimetype.startsWith('image'))
        messageType = 'image';
    else if(req.file.mimetype.startsWith('audio'))
        messageType = 'audio';

    const fileUrl = `/uploads/${req.file.filename}`;
    
    try {
        const newMessage = new Message(
            {
                senderId: req.body.senderId,
                receiverId: req.body.receiverId,
                messageType: messageType,
                content: fileUrl,
                status: 'sent',
                timestamp: new Date()
            }
        );
        await newMessage.save();
        res.send({message: 'File uploaded and message sent successfully', fileUrl});
    } catch (error) {
        res.status(500).send('Error processing file upload');   
    }
}