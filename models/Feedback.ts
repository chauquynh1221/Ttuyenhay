import mongoose, { Schema } from 'mongoose'

const FeedbackSchema = new Schema(
    {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        message: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        resolved: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
)

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)
