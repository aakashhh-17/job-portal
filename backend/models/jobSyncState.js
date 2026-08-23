import mongoose from 'mongoose';

const jobSyncStateSchema = new mongoose.Schema({
  source: { type: String, required: true, unique: true },
  lastFetchedAt: { type: Date },
  lastRunStats: {
    fetched: Number,
    created: Number,
    updated: Number,
    ranAt: Date,
  },
});

const JobSyncState = mongoose.model('JobSyncState', jobSyncStateSchema);

export default JobSyncState;