import { User } from '@prisma/client';

abstract class IGetAvatarUserService {
  findByAvatar: (avatar: string) => Promise<User>;
}
export { IGetAvatarUserService };
