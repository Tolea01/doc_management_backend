import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import IPagination from 'app/common/interfaces/pagination.interface';
import { translateMessage } from 'app/utils/translateMessage';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { SortOrder } from 'database/validators/typeorm.sort.validator';
import { I18nService } from 'nestjs-i18n';
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
  USER_RELATIONS = [
    'entry_documents_executors',
    'entry_documents_coordinators',
    'internal_documents_executors',
    'internal_documents_coordinators',
    'exit_documents_executors',
  ];
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto, user: any): Promise<UserItemDto> {
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

      const newUser: CreateUserDto = await this.userRepository.save({
        ...createUserDto,
        created_by: user.userId,
        password: await argon2.hash(createUserDto.password),
      });

      return plainToInstance(UserItemDto, newUser);
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
  ): Promise<IPagination<UserItemDto>> {
    try {
      const filterBuilder: UserFilterBuilder = new UserFilterBuilder(filter);
      const queryBuilder: SelectQueryBuilder<User> = this.userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect(
          'users.entry_documents_executors',
          'entry_documents_executors',
        )
        .leftJoinAndSelect(
          'users.entry_documents_coordinators',
          'entry_documents_coordinators',
        )
        .leftJoinAndSelect(
          'users.internal_documents_executors',
          'internal_documents_executors',
        )
        .leftJoinAndSelect(
          'users.internal_documents_coordinators',
          'internal_documents_coordinators',
        )
        .leftJoinAndSelect(
          'users.exit_documents_executors',
          'exit_documents_executors',
        )
        .where(filterBuilder.getFilter())
        .orderBy(`users.${sortColumn}`, sortOrder)
        .skip((page - 1) * limit)
        .take(limit);

      const [data, total]: [User[], number] =
        await queryBuilder.getManyAndCount();

      return {
        data: plainToInstance(UserItemDto, data),
        total,
        page,
        limit,
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
        relations: this.USER_RELATIONS,
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

  async findByIds(ids: number[]): Promise<UserItemDto[]> {
    try {
      const users: User[] = await this.userRepository.find({
        where: { id: In(ids) },
        relations: this.USER_RELATIONS,
      });

      return plainToInstance(UserItemDto, users);
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
    user: any,
  ): Promise<UpdateUserDto> {
    try {
      await this.findOne(id);

      if (updateUserDto.password) {
        updateUserDto.password = await argon2.hash(updateUserDto.password);
      }

      await this.userRepository.update(id, {
        updated_by: user.userId,
        updated_at: new Date(),
        ...updateUserDto,
      });

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
