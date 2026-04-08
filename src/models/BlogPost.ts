import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBlogPost extends Document {
  title: string
  excerpt: string
  author: string
  category: string
  image: string
  readTime: string
  published: boolean
  createdAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>({
  title:     { type: String, required: true },
  excerpt:   { type: String, required: true },
  author:    { type: String, required: true },
  category:  { type: String, required: true },
  image:     { type: String, default: '' },
  readTime:  { type: String, default: '5 min read' },
  published: { type: Boolean, default: false },
}, { timestamps: true })

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)

export default BlogPost
