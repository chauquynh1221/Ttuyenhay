import mongoose, { Schema } from 'mongoose'

const ChapterReportSchema = new Schema(
    {
        truyenSlug: { type: String, required: true, index: true },
        chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
        chapterNumber: { type: Number },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        guestName: { type: String, default: '' },
        type: {
            type: String,
            enum: ['thieu_noi_dung', 'sai_noi_dung', 'loi_font', 'khac'],
            required: true,
        },
        message: { type: String, default: '' },
        resolved: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export default mongoose.models.ChapterReport ||
    mongoose.model('ChapterReport', ChapterReportSchema)
