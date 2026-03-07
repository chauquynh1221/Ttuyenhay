import mongoose, { Schema, Document } from 'mongoose'

export interface IChapter extends Document {
  truyenId: mongoose.Types.ObjectId
  chapterNumber: number
  title: string
  content: string
  wordCount: number
  views: number
  createdAt: Date
  updatedAt: Date
}

const ChapterSchema: Schema = new Schema(
  {
    truyenId: {
      type: Schema.Types.ObjectId,
      ref: 'Truyen',
      required: true,
      index: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Compound unique index
ChapterSchema.index({ truyenId: 1, chapterNumber: 1 }, { unique: true })

// Indexes for common queries
ChapterSchema.index({ truyenId: 1, chapterNumber: 1 })
ChapterSchema.index({ createdAt: -1 })

// Pre-save hook to calculate word count
ChapterSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.wordCount = (this as any).content.trim().split(/\s+/).length
  }
  next()
})

export default mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema)
