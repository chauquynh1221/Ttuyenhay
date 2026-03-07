import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IComment extends Document {
    truyenId: mongoose.Types.ObjectId
    chapterId?: mongoose.Types.ObjectId
    parentId?: mongoose.Types.ObjectId  // null = root, có = reply
    userId?: mongoose.Types.ObjectId    // null nếu guest
    userName: string
    content: string
    likes: number
    likedBy: mongoose.Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
    {
        truyenId: { type: Schema.Types.ObjectId, ref: 'Truyen', required: true, index: true },
        chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', default: null },
        parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },  // null = guest
        userName: { type: String, required: true },
        content: { type: String, required: true, maxlength: 2000 },
        likes: { type: Number, default: 0 },
        likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
)

CommentSchema.index({ truyenId: 1, createdAt: -1 })
CommentSchema.index({ chapterId: 1, createdAt: -1 })
CommentSchema.index({ parentId: 1 })

const Comment: Model<IComment> =
    mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
export default Comment
