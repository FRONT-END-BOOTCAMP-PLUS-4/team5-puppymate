import { StorageRepository } from '@/domain/repositories/StorageRepository';
import { createClient } from '@/utils/supabase/server';

export class SbStorageRepository implements StorageRepository {
  private readonly bucketName = 'images';
  private readonly profileFolderPath = 'profile';
  private readonly postFolderPath = 'post';

  async save(file: File): Promise<string> {
    const supabase = await createClient();

    const originalName = file.name
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/[^\w.]+/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase();

    const timestamp = Date.now();
    let fileName = `${timestamp}_${originalName}`;
    let filePath = `${this.profileFolderPath}/${fileName}`;
    let counter = 1;

    while (true) {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(this.profileFolderPath, { search: fileName });

      if (error) {
        throw new Error(`Error checking file existence: ${error.message}`);
      }

      if (data && data.some((item) => item.name === fileName)) {
        const [name, extension] = fileName.split(/\.(?=[^\.]+$)/);
        fileName = `${name}_${counter}.${extension}`;
        filePath = `${this.profileFolderPath}/${fileName}`;
        counter++;
      } else {
        break;
      }
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    return uploadData?.path || '';
  }
  async saveMany(files: File[]): Promise<string[]> {
    const supabase = await createClient();
    const uploadedPaths: string[] = [];

    for (const file of files) {
      // 안전한 파일명으로 변환
      const originalName = file.name
        .normalize('NFKD')
        .replace(/[\u0300-\u036F]/g, '')
        .replace(/[^\w.]+/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase();

      const timestamp = Date.now();
      let fileName = `${timestamp}_${originalName}`;
      let filePath = `${this.postFolderPath}/${fileName}`;
      let counter = 1;

      // 중복된 파일명 방지
      while (true) {
        const { data, error } = await supabase.storage
          .from(this.bucketName)
          .list(this.postFolderPath, { search: fileName });

        if (error) {
          throw new Error(`Error checking file existence: ${error.message}`);
        }

        if (data && data.some((item: { name: string }) => item.name === fileName)) {
          const [name, extension] = fileName.split(/\.(?=[^\.]+$)/);
          fileName = `${name}_${counter}.${extension}`;
          filePath = `${this.postFolderPath}/${fileName}`;
          counter++;
        } else {
          break;
        }
      }

      // 파일 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      if (uploadData?.path) {
        uploadedPaths.push(uploadData.path);
      }
    }

    return uploadedPaths;
  }
  async getPublicUrl(filePath: string): Promise<string> {
    const supabase = await createClient();

    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
