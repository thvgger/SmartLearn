import { inngest } from './client';
import { rebuildDashboardData } from '../backup-restore';

export const processBackupSync = inngest.createFunction(
  { id: 'process-backup-sync', concurrency: 1 },
  { event: 'backup/sync.requested' },
  async ({ event, step }) => {
    const { userId, parsedData } = event.data;
    
    await step.run('rebuild-dashboard-data', async () => {
      await rebuildDashboardData(userId, parsedData);
    });

    return { success: true };
  }
);
