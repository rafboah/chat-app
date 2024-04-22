const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        email: {type:String, required:true, unique:true},
        username: {type:String, required:true, unique:true},
        fullname: {type:String, required:true},
        password: {type:String, required:true},
        gender: {type:String, required:true},
        createdAt: {type:Date, default:Date.now}
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