import mongoose, { Schema } from 'mongoose';

const scrapeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      default: 'Untitled',
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ScrapedData', scrapeSchema);
