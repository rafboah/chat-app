const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type:String, 
            required:true, 
            unique:true, 
            lowercase:true, 
            trim:true, 
            match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Valid email required']
        },
        username: {
            type:String, 
            required:true, 
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname: {
            type:String, 
            required:true,
            trim:true
        },
        password: {
            type:String, 
            required:true,
            minlength:[8, 'Minimum password length required: 8'],
            match:[/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, 'Password must include special characters and digits']
        },
        gender: {
            type:String, 
            required:true
        },
        createdAt: {
            type:Date, 
            default:Date.now
        }
    }
);

UserSchema.pre('save', async function(next){
    if(this.isModified('password') || this.isNew)
        this.password = await bcrypt.hash(this.password, 12);

    next();
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;