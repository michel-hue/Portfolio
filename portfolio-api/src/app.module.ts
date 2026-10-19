import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { ContactModule } from './contact/contact.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SkillsModule } from './skills/skills.module.js';
import { UploadModule } from './upload/upload.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,

      synchronize: true,
    }),
    ProjectsModule,
    ProfileModule,
    ContactModule,
    UsersModule,
    AuthModule,
    SkillsModule,
    UploadModule,
  ],
})
export class AppModule {}
