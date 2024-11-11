import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PersonSeeder } from './seeders/person.seeder';
import { UserSeeder } from './seeders/user.seeder';
import { SeedsModule } from './seeds.module';

async function runSeed(): Promise<void> {
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(SeedsModule);

  const userSeeder: UserSeeder = app.get(UserSeeder);
  const personSeeder: PersonSeeder = app.get(PersonSeeder);

  console.log('Seeding users...');
  await userSeeder.seed();

  console.log('Seeding persons...');
  await personSeeder.seed();

  await app.close();
}

runSeed().catch((error: unknown) => {
  console.log('Seeding error:', error);
  process.exit(1);
});
