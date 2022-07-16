const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
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
    }

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

mongoose.model('User',userSchema);