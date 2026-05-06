import express, { Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import Leave from '../models/Leave';
import User from '../models/User';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

const router = express.Router();

// Get employee's leave history
router.get('/my-leaves', protect, async (req: AuthRequest, res: Response) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for leave
router.post('/apply', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    const start = startOfDay(parseISO(startDate));
    const end = startOfDay(parseISO(endDate));
    
    // Simple naive day calculation - in production, skip weekends/holidays
    const days = differenceInDays(end, start) + 1;

    if (days <= 0) {
      res.status(400).json({ message: 'End date must be after start date' });
      return;
    }

    if (req.user.leaveBalance < days && leaveType !== 'unpaid') {
      res.status(400).json({ message: 'Insufficient leave balance' });
      return;
    }

    // Checking for overlapping leaves
    const overlapping = await Leave.findOne({
      employee: req.user._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlapping) {
      res.status(400).json({ message: 'Leave dates overlap with an existing request' });
      return;
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      days,
    });

    res.status(201).json(leave);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
