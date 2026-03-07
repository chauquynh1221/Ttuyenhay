import mongoose, { Schema } from 'mongoose'

const FollowSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        truyenId: { type: Schema.Types.ObjectId, ref: 'Truyen', required: true },
        truyenSlug: { type: String, required: true },
        truyenTitle: { type: String, required: true },
        truyenCover: { type: String, default: '' },
    },
    { timestamps: true }
)

FollowSchema.index({ userId: 1, truyenId: 1 }, { unique: true })

export default mongoose.models.Follow || mongoose.model('Follow', FollowSchema)
