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
  role: 'user' | 'admin'
  isBanned: boolean
  emailVerified: boolean
  emailVerifyToken?: string
  emailVerifyExpires?: Date
  resetToken?: string
  resetTokenExpires?: Date
  bookmarks: IBookmark[]
  readingHistory: IReadingHistory[]
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
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    isBanned: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, index: true, sparse: true },
    emailVerifyExpires: { type: Date },
    resetToken: { type: String, index: true, sparse: true },
    resetTokenExpires: { type: Date },
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
  },
  {
    timestamps: true,
  }
)

// Lưu ý: email & role đã có `index: true` trong schema nên KHÔNG khai báo lại ở đây
// (tránh cảnh báo "Duplicate schema index" của Mongoose).

// Giới hạn lịch sử đọc 100 mục & tủ sách 500 mục (tránh document phình to)
UserSchema.pre('save', function (next) {
  const user = this as any
  if (user.readingHistory && user.readingHistory.length > 100) {
    user.readingHistory = user.readingHistory.slice(-100)
  }
  if (user.bookmarks && user.bookmarks.length > 500) {
    user.bookmarks = user.bookmarks.slice(-500)
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
