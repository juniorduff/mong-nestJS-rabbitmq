abstract class IDeleteUserService {
  delete: (user_id: string) => Promise<void>;
}
export { IDeleteUserService };
