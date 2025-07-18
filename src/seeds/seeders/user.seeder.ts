import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'app/modules/user/entities/user.entity';
import { UserRole } from 'app/modules/user/roles/role.enum';
import { hash } from 'argon2';
import { Repository } from 'typeorm';
import IUserData from './interfaces/user.data.interface';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    const adminUsers: User[] | undefined = await this.userRepository.find({
      where: { role: UserRole.ADMIN },
    });

    if (adminUsers.length === 0) {
      const defaultAdmin = await this.userRepository.save(
        this.userRepository.create({
          name: 'Default',
          surname: 'Admin',
          password: await hash('password'),
          role: UserRole.ADMIN,
          photo: faker.image.avatar(),
          phone_number: faker.phone.number().slice(0, 15),
          email_address: 'default.admin@example.com',
        }),
      );

      adminUsers.push(defaultAdmin);
    }

    const randomAdmin = faker.helpers.arrayElement(adminUsers);

    const data: IUserData[] = await Promise.all(
      Array.from({ length: 20 }, async () => ({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        password: await hash('password'),
        role: faker.helpers.arrayElement(Object.values(UserRole)),
        photo: faker.image.avatar(),
        phone_number: faker.phone.number().slice(0, 15),
        email_address: faker.internet.email(),
        created_by: randomAdmin.id,
      })),
    );

    for (const userData of data) {
      const userExist: User | undefined = await this.userRepository.findOneBy({
        email_address: userData.email_address,
      });
      if (!userExist) {
        await this.userRepository.save(this.userRepository.create(userData));
      }
    }
  }
}
