export interface StorageRepository {
  save(file: File): Promise<string>;
  saveMany(file: File[]): Promise<string[]>;
  getPublicUrl(fileName: string): Promise<string>;
}
