abstract class IGetUploadService {
  upload: (file: string, user_id: string) => Promise<any>;
}
export { IGetUploadService };
