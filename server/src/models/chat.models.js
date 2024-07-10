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

export default mongoose.model('Chat', chatSchema);