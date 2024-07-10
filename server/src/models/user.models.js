import mongoose,{Schema} from 'mongoose';

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
});

export default mongoose.model('User', userSchema);