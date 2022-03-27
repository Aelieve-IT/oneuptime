import mongoose from '../config/db'
const Schema = mongoose.Schema;

const incidentCommunicationSlaSchema = new Schema(
    {
        name: String,
        projectId: { ref: 'Project', type: Schema.Types.ObjectId, index: true },
        isDefault: { type: Boolean, default: false },
        duration: { type: String, default: '60' },
        alertTime: String,
        deleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true } //automatically adds createdAt and updatedAt to the collection
);

export default mongoose.model(
    'IncidentCommunicationSla',
    incidentCommunicationSlaSchema
);