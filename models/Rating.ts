import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IRating extends Document {
    truyenId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    score: number     // 1-10
    createdAt: Date
}

const RatingSchema = new Schema<IRating>(
    {
        truyenId: { type: Schema.Types.ObjectId, ref: 'Truyen', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, required: true, min: 1, max: 10 },
    },
    { timestamps: true }
)

// Mỗi user chỉ rate 1 lần mỗi truyện
RatingSchema.index({ truyenId: 1, userId: 1 }, { unique: true })

const Rating: Model<IRating> =
    mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema)
export default Rating
