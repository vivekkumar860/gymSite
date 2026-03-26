import { Injectable, Logger } from '@nestjs/common';
import { FileStoragePort } from './file-storage.port';
import * as fs from 'fs/promises';
import * as path from 'path';

const UPLOAD_DIR = './uploads';

/** Local filesystem adapter — used in development only. */
@Injectable()
export class LocalStorageAdapter extends FileStoragePort {
  private readonly logger = new Logger(LocalStorageAdapter.name);

  async upload(buffer: Buffer, destinationPath: string): Promise<string> {
    const fullPath = path.join(UPLOAD_DIR, destinationPath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, buffer);

    this.logger.debug(`File saved: ${fullPath}`);
    return destinationPath;
  }

  async getSignedUrl(storagePath: string): Promise<string> {
    return `/uploads/${storagePath}`;
  }

  async delete(storagePath: string): Promise<void> {
    const fullPath = path.join(UPLOAD_DIR, storagePath);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      this.logger.warn(`File not found for deletion: ${fullPath}`);
    }
  }
}
