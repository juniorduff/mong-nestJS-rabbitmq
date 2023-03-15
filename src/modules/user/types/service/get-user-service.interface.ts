import { User } from '@prisma/client';

abstract class IGetUserService {
  findById: (user_id: string) => Promise<User>;
}
export { IGetUserService };
