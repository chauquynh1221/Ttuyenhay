import mongoose, { Schema, Document } from 'mongoose'

export interface ITruyen extends Document {
  title: string
  slug: string
  author: string
  description: string
  coverImage?: string
  genres: string[]
  status: 'ongoing' | 'completed' | 'paused'
  views: number
  rating: number
  reviewCount: number
  totalChapters: number
  isHot: boolean
  isFull: boolean
  isNew: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  createdAt: Date
  updatedAt: Date
}

const TruyenSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    genres: [{
      type: String,
      trim: true,
      index: true,
    }],
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'paused'],
      default: 'ongoing',
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
    isHot: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFull: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNew: {
      type: Boolean,
      default: false,
      index: true,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    metaKeywords: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
)

// Full-text search index
TruyenSchema.index({
  title: 'text',
  author: 'text',
  description: 'text',
}, {
  weights: {
    title: 10,
    author: 5,
    description: 1,
  },
})

// Compound indexes for common queries
TruyenSchema.index({ isHot: -1, views: -1 })
TruyenSchema.index({ isFull: -1, updatedAt: -1 })
TruyenSchema.index({ isNew: -1, createdAt: -1 })
TruyenSchema.index({ updatedAt: -1 })
TruyenSchema.index({ views: -1 })

export default mongoose.models.Truyen || mongoose.model<ITruyen>('Truyen', TruyenSchema)
