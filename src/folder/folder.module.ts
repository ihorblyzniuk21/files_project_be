import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEntity } from '@app/folder/folder.entity';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity, UserEntity])],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
