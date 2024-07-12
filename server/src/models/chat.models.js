import mongoose,{Schema} from 'mongoose';

const chatSchema = new Schema({
    role:{
        type: String,
        required: true
    },
    parts:[
        {
            text:{
                type: String,
                required: true
            },
        }
    ]
    });

export const Chat = mongoose.model("Chat", chatSchema)