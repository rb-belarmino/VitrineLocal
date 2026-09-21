import { Logger } from '../../../shared/logger/logger';

export type JobHandler<T> = () => Promise<T>;

export interface QueuedJob<T> {
  id: string;
  handler: JobHandler<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
  enqueuedAt: Date;
}

export class JobQueue {
  private queue: QueuedJob<unknown>[] = [];
  private isProcessing = false;
  private currentJobId: string | null = null;

  /**
   * Adiciona uma tarefa à fila FIFO e processa se nenhuma outra estiver em execução.
   */
  public enqueue<T>(id: string, handler: JobHandler<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const queuedJob: QueuedJob<T> = {
        id,
        handler,
        resolve: resolve as (value: unknown) => void,
        reject,
        enqueuedAt: new Date(),
      };

      this.queue.push(queuedJob as QueuedJob<unknown>);
      Logger.info(`Job enfileirado na fila FIFO: ${id}. Posição: ${this.queue.length}`);

      void this.processNext();
    });
  }

  /**
   * Processa o próximo job da fila sequencialmente.
   */
  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.isProcessing = true;
    this.currentJobId = job.id;

    Logger.info(`Iniciando execução do job: ${job.id}`);
    const startTime = Date.now();

    try {
      const result = await job.handler();
      const elapsed = Date.now() - startTime;
      Logger.info(`Job ${job.id} concluído com sucesso em ${elapsed}ms`);
      job.resolve(result);
    } catch (error) {
      const elapsed = Date.now() - startTime;
      Logger.error(`Job ${job.id} falhou após ${elapsed}ms`, error);
      job.reject(error);
    } finally {
      this.isProcessing = false;
      this.currentJobId = null;
      // Processa o próximo da fila
      void this.processNext();
    }
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public isBusy(): boolean {
    return this.isProcessing;
  }

  public getCurrentJobId(): string | null {
    return this.currentJobId;
  }
}

// Instância singleton da fila para garantir concorrência máxima de 1 no processo
export const globalJobQueue = new JobQueue();
