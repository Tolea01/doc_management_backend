import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { translateMessage } from 'app/utils/translateMessage';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { SortOrder } from 'database/validators/typeorm.sort.validator';
import { I18nService } from 'nestjs-i18n';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { UserFilterBuilder } from './builders/user.filter.builder';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserItemDto } from './dto/user-item.dto';
import { User } from './entities/user.entity';
import { UserSort } from './validators/user.sort.validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserItemDto> {
    try {
      const existUser: User | undefined = await this.userRepository.findOne({
        where: { email_address: createUserDto.email_address },
      });

      if (existUser) {
        throw new ConflictException(
          await translateMessage(this.i18n, 'error.user_already_exists', {
            email: existUser.email_address,
          }),
        );
      }

      const user: CreateUserDto = await this.userRepository.save({
        ...createUserDto,
        password: await argon2.hash(createUserDto.password),
      });

      return plainToInstance(UserItemDto, user);
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.registration_failed', {
          error: error.message,
        }),
      );
    }
  }

  async findAll(
    limit?: number,
    page?: number,
    sortOrder?: SortOrder,
    sortColumn?: UserSort,
    filter?: UserFilterDto,
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
        await translateMessage(this.i18n, 'error.fetch_users_failed', {
          error: error.message,
        }),
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
        await translateMessage(this.i18n, 'error.user_not_found', {
          id,
          error: error.message,
        }),
      );
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user: User | undefined = await this.userRepository.findOneOrFail({
        where: { email_address: email },
      });

      return user;
    } catch (error) {
      throw new NotFoundException(
        await translateMessage(this.i18n, 'error.user_not_found', {
          email,
          error: error.message,
        }),
      );
    }
  }

  async findByIds(ids: number[]): Promise<User[]> {
    try {
      const users: User[] | undefined = await this.userRepository.findBy({
        id: In(ids),
      });

      return users;
    } catch (error) {
      throw new NotFoundException(
        await translateMessage(this.i18n, 'error.user_not_found', {
          id: ids,
          error: error.message,
        }),
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
        await translateMessage(this.i18n, 'error.update_failed', {
          id,
          error: error.message,
        }),
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.delete_failed', {
          id,
          error: error.message,
        }),
      );
    }
  }
}
