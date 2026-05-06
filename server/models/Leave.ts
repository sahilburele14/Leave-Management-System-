import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface ILeave extends Document {
  employee: mongoose.Types.ObjectId | IUser;
  leaveType: 'sick' | 'casual' | 'earned' | 'unpaid';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema = new Schema<ILeave>({
  employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['sick', 'casual', 'earned', 'unpaid'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  days: { type: Number, required: true }
}, { timestamps: true });

const Leave = (mongoose.models.Leave as mongoose.Model<ILeave>) || mongoose.model<ILeave>('Leave', LeaveSchema);

export default Leave;
