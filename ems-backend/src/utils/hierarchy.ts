import { Types } from 'mongoose';
import Employee from '../models/Employee';

export const isCircularReporting = async (
  employeeId: string | Types.ObjectId,
  proposedManagerId: string | Types.ObjectId | null
): Promise<boolean> => {
  if (!proposedManagerId) return false;
  if (employeeId.toString() === proposedManagerId.toString()) return true;

  let currentManagerId: any = proposedManagerId;

  while (currentManagerId) {
    const manager = await Employee.findById(currentManagerId).select('reportingManager');
    if (!manager) break;

    if (manager.reportingManager && manager.reportingManager.toString() === employeeId.toString()) {
      return true;
    }
    currentManagerId = manager.reportingManager;
  }

  return false;
};