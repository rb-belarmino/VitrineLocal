import { describe, it, expect } from 'vitest';
import { JobQueue } from '../core/job-queue';

describe('JobQueue (FIFO Execution)', () => {
  it('deve processar jobs sequencialmente na ordem de inserção', async () => {
    const queue = new JobQueue();
    const order: number[] = [];

    const p1 = queue.enqueue('job-1', async () => {
      await new Promise((r) => setTimeout(r, 20));
      order.push(1);
      return 'res-1';
    });

    const p2 = queue.enqueue('job-2', async () => {
      order.push(2);
      return 'res-2';
    });

    expect(queue.isBusy()).toBe(true);

    const [r1, r2] = await Promise.all([p1, p2]);

    expect(r1).toBe('res-1');
    expect(r2).toBe('res-2');
    expect(order).toEqual([1, 2]);
    expect(queue.isBusy()).toBe(false);
    expect(queue.getQueueLength()).toBe(0);
    expect(queue.getCurrentJobId()).toBeNull();
  });

  it('deve lidar com falha em um job sem interromper a fila', async () => {
    const queue = new JobQueue();

    const p1 = queue.enqueue('failing-job', async () => {
      throw new Error('Falha intencional');
    });

    const p2 = queue.enqueue('success-job', async () => {
      return 'sucesso';
    });

    await expect(p1).rejects.toThrow('Falha intencional');
    await expect(p2).resolves.toBe('sucesso');
  });
});
