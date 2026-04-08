import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProject extends Document {
  title: string
  category: string
  location: string
  description: string
  image: string
  featured: boolean
  createdAt: Date
}

const ProjectSchema = new Schema<IProject>({
  title:       { type: String, required: true },
  category:    { type: String, required: true },
  location:    { type: String, required: true },
  description: { type: String, required: true },
  image:       { type: String, default: '' },
  featured:    { type: Boolean, default: false },
}, { timestamps: true })

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)

export default Project
