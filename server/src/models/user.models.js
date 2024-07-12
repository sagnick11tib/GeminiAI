import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users can have the same email
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  guestFlag:{
    type: Boolean,
    default: false
  },
  chats:[
    {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }
  ],
  credits:{
        type: Number,
        default: 25
    },
    refreshToken:{
        type: String
    },
},
{
    timestamps: true,
});

// Hash the password before saving the user
userSchema.pre('save', async function(next){//1st parameter is the event, 2nd is the function to run(callback function) why not use arrow function? because we need to use this keyword to refer to the user object but arrow function does not have its own this keyword
if(!this.isModified('password')) return next();//if the password is not modified, then skip this function
this.password = bcrypt.hashSync(this.password, 10);
next();
});

// custome method for password match check  
userSchema.methods.isPasswordMatch = async function(enteredPassword){ 
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema)