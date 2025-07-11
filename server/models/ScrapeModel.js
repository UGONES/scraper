import mongoose from 'mongoose';

const scrapeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  intro: String,
  analysis: String,
  result: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending',
  },

},
  {
    timestamps: true,
  }
);

export default mongoose.model('Scrape', scrapeSchema);
