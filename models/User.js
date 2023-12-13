const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: null
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required: false,
        default: null
    },
    provider:{
        type:String,
        required: false,
        default: null
    },
    provider_id:{
        type:String,
        required: false,
        default: null
    },
    avatar:{
        type:String,
        required: false,
        default: null
    },
    friendRequests: {
        type:Array,
        require:false,
        default: null
    },
    sentFriendRequests: {
        type:Array,
        require:false,
        default: null
    },
    device_token:{
        type:String,
        required: false,
        default: null
    },
    about:{
        type:String,
        required: false,
        default: null
    }

},
{
    timestamps: true
})

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err)
        }
     bcrypt.hash(user.password,salt,(err,hash)=>{
         if(err){
             return next(err)
         }
         user.password = hash;
         next()
     })

    })


})


userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if (!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })

}

const User = mongoose.model('User',userSchema);
module.exports = User;
