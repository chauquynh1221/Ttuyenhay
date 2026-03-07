import mongoose, { Schema, Document } from 'mongoose'

export interface IBookmark {
  truyenId: mongoose.Types.ObjectId
  currentChapter: number
  addedAt: Date
}

export interface IReadingHistory {
  truyenId: mongoose.Types.ObjectId
  chapterId: mongoose.Types.ObjectId
  readAt: Date
}

export interface IUser extends Document {
  email: string
  name: string
  password?: string
  googleId?: string
  avatar?: string
  role: 'user' | 'vip' | 'admin'
  bookmarks: IBookmark[]
  readingHistory: IReadingHistory[]
  vipExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,  // optional khi đăng nhập bằng Google
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'vip', 'admin'],
      default: 'user',
      index: true,
    },
    bookmarks: [
      {
        truyenId: {
          type: Schema.Types.ObjectId,
          ref: 'Truyen',
        },
        currentChapter: {
          type: Number,
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    readingHistory: [
      {
        truyenId: {
          type: Schema.Types.ObjectId,
          ref: 'Truyen',
        },
        chapterId: {
          type: Schema.Types.ObjectId,
          ref: 'Chapter',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    vipExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

// Limit reading history to last 100 items
UserSchema.pre('save', function (next) {
  const user = this as any
  if (user.readingHistory && user.readingHistory.length > 100) {
    user.readingHistory = user.readingHistory.slice(-100)
  }
  next()
})

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const bcrypt = require('bcryptjs')
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
