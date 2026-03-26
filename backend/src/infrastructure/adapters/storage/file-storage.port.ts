/** Abstract port for file storage — services depend on this, not on S3/local directly. */
export abstract class FileStoragePort {
  /** Upload a file buffer and return the storage path. */
  abstract upload(buffer: Buffer, destinationPath: string): Promise<string>;

  /** Generate a time-limited URL for a stored file. */
  abstract getSignedUrl(storagePath: string): Promise<string>;

  /** Delete a file from storage. */
  abstract delete(storagePath: string): Promise<void>;
}
