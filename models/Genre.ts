import mongoose, { Schema, Document } from 'mongoose'

export interface IGenre extends Document {
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const GenreSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes are already defined in the schema with unique: true

export default mongoose.models.Genre || mongoose.model<IGenre>('Genre', GenreSchema)
