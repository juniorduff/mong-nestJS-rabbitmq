import { User } from '@prisma/client';

abstract class IUserRepository {
  create: (data: any) => Promise<User>;
  findById: (user_id: string) => Promise<User>;
  deleteById: (user_id: string) => Promise<void>;
  findByEmail: (email: string) => Promise<User>;
  uploadAvatar: (file: string, user_id: string) => Promise<any>;

  findByAvatar: (avatar: string) => Promise<User>;
}

export { IUserRepository };
