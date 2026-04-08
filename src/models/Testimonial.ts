import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITestimonial extends Document {
  name: string
  position: string
  company: string
  content: string
  rating: number
  image: string
  approved: boolean
  createdAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>({
  name:     { type: String, required: true },
  position: { type: String, required: true },
  company:  { type: String, required: true },
  content:  { type: String, required: true },
  rating:   { type: Number, min: 1, max: 5, default: 5 },
  image:    { type: String, default: '' },
  approved: { type: Boolean, default: false },
}, { timestamps: true })

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)

export default Testimonial
