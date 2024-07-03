import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserItemDto } from './dto/user-item.dto';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { SortOrder } from 'src/database/validators/typeorm.sort.validator';
import { UserSort } from './validators/user.sort.validator';
import { UserFilterBuilder } from './builders/user.filter.builder';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserItemDto> {
    try {
      const existUser: User | undefined = await this.userRepository.findOne({
        where: { email_address: createUserDto.email_address },
      });

      if (existUser) {
        throw new ConflictException(
          `User with email ${createUserDto.email_address} already exists`,
        );
      }

      const user: CreateUserDto = await this.userRepository.save({
        ...createUserDto,
        password: await argon2.hash(createUserDto.password),
      });

      return plainToInstance(UserItemDto, user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to register user. ${error.message}`,
      );
    }
  }

  async findAll(
    limit?: number,
    page?: number,
    sortOrder?: SortOrder,
    sortColumn?: UserSort,
    filter?: Record<string, any>,
  ): Promise<Pagination<UserItemDto>> {
    try {
      const filterBuilder: UserFilterBuilder = new UserFilterBuilder(filter);
      const queryBuilder: SelectQueryBuilder<User> = this.userRepository
        .createQueryBuilder('users')
        .where(filterBuilder.getFilter())
        .orderBy(sortColumn, sortOrder)
        .skip(page * limit)
        .take(limit);

      const result: Pagination<User, IPaginationMeta> = await paginate<User>(
        queryBuilder,
        { limit, page },
      );

      return {
        ...result,
        items: plainToInstance(UserItemDto, result.items),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch users. ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<UserItemDto | undefined> {
    try {
      const user: User = await this.userRepository.findOneOrFail({
        where: { id },
      });

      return plainToInstance(UserItemDto, user);
    } catch (error) {
      throw new NotFoundException(
        `User with id ${id} not found. ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
      await this.findOne(id);

      if (updateUserDto.password) {
        updateUserDto.password = await argon2.hash(updateUserDto.password);
      }

      await this.userRepository.update(id, updateUserDto);

      return {
        ...updateUserDto,
        password: updateUserDto.password
          ? 'Password updated successfully'
          : undefined,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update user with id ${id}. ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete user with id ${id}. ${error.message}`,
      );
    }
  }
}
