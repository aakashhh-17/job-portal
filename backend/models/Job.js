import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {type:String, required:true},
    description: {type:String, required:true},
    location: {type:String, required:true},
    category: {type:String, required:true},
    level: {type:String, default: 'Not specified'},        // was required:true
    salary: {type:Number, default: 0},                      // was required:true
    date: {type:Number, required:true},
    visible: {type:Boolean, default:true},
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: function () { return this.source === 'internal'; }
    },
    // NEW: external ingestion fields
    source: { type: String, enum: ['internal', 'adzuna'], default: 'internal' },
    externalId: { type: String },
    sourceUrl: { type: String },       // link back to the original posting
    companyName: { type: String },     // denormalized, for jobs with no Company doc
    companyLogo: { type: String },
})

jobSchema.index({ source: 1, externalId: 1 }, { unique: true, sparse: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;