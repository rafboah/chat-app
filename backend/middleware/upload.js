const multer = require('multer');
const path = require('path');


// file filter for security
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const ext = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if(mimetype && ext)
        return cb(null, true);

    cb('Error: Images Only');
}

//set storage engine
const storage = multer.diskStorage({
    destination: '../uploads/',
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});

const upload = multer(
    {
        storage: storage,
        limits: {fileSize: 2000000},
        fileFilter: fileFilter
    }
);

module.exports = upload;