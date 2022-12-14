import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { TokenModule } from '@app/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
