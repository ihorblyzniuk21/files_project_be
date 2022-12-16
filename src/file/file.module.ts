import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEntity } from '@app/folder/folder.entity';
import { UserEntity } from '@app/user/user.entity';
import { FileEntity } from '@app/file/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity, UserEntity, FileEntity])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
