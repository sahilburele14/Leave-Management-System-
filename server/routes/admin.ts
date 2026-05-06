import express, { Response } from 'express';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';
import Leave from '../models/Leave';
import User from '../models/User';

const router = express.Router();

router.use(protect, adminOnly);

// Get all leaves (can be filtered by status)
router.get('/leaves', async (req: AuthRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const filter: any = status && status !== 'all' ? { status } : {};
  
  try {
    const leaves = await Leave.find(filter)
      .populate('employee', 'name email leaveBalance')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject a leave
router.put('/leaves/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body; // 'approved' or 'rejected'
  
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      res.status(404).json({ message: 'Leave request not found' });
      return;
    }

    if (leave.status !== 'pending') {
      res.status(400).json({ message: `Leave has already been ${leave.status}` });
      return;
    }

    leave.status = status;
    await leave.save();

    // If approved, deduct balance
    if (status === 'approved' && leave.leaveType !== 'unpaid') {
      const user = await User.findById(leave.employee);
      if (user) {
        user.leaveBalance -= leave.days;
        await user.save();
      }
    }

    res.json(leave);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Dashboard stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const pendingRequests = await Leave.countDocuments({ status: 'pending' });
    const approvedTotal = await Leave.countDocuments({ status: 'approved' });
    const rejectedTotal = await Leave.countDocuments({ status: 'rejected' });
    
    res.json({
      totalEmployees,
      pendingRequests,
      approvedTotal,
      rejectedTotal
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
