import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';
import { UserDto } from '../../dto/user.dto';
import { ICreateUserService } from '../../types/service/create-user-service.interface';
import { IUserRepository } from '../../types/repository/create-user.interface';
import { UserRepository } from '../../repository/user.repository';
import { PrismaService } from '../../../../../prisma/prisma.service';

const userRepositoryMock = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        UserRepository,
        PrismaService,
        {
          provide: IUserRepository,
          useValue: {},
        },
      ],
    }).compile();

    createUserService = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('definition', () => {
    it('should be defined', () => {
      expect(createUserService).toBeDefined();
    });
  });

  describe('CreateUserService', () => {
    let service: ICreateUserService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CreateUserService,
          { provide: IUserRepository, useValue: userRepositoryMock },
        ],
      }).compile();

      service = module.get<ICreateUserService>(CreateUserService);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('create', () => {
      it('should create a user', async () => {
        const userDto: UserDto = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          id: '1',
          created_at: new Date(),
          avatar_url: null,
        };

        userRepositoryMock.findByEmail.mockReturnValueOnce(undefined);
        userRepositoryMock.create.mockReturnValueOnce(userDto);

        const result = await service.create(userDto);

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
          userDto.email,
        );
        expect(userRepositoryMock.create).toHaveBeenCalledWith(userDto);
        expect(result).toEqual(userDto);
      });
    });
    it('should create a user', async () => {
      const userDto: UserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        id: '1',
        created_at: new Date(),
        avatar_url: null,
      };

      userRepositoryMock.findByEmail.mockReturnValueOnce(undefined);
      userRepositoryMock.create.mockReturnValueOnce(userDto);

      const result = await service.create(userDto);

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        userDto.email,
      );
      expect(userRepositoryMock.create).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(userDto);
    });
  });
});
