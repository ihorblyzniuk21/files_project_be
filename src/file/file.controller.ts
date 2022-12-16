import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@app/file/file.service';
import { DeleteResult } from 'typeorm';
import { FileEntity } from '@app/file/file.entity';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async addFile(
    @User() currentUser: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Param('id') folderId: string,
  ): Promise<FileEntity> {
    return await this.fileService.addFile(file, body, currentUser, folderId);
  }

  @Get('/:id')
  async getAll(
    @User() currentUser: UserEntity,
    @Param('id') folderId: string,
  ): Promise<FileEntity[]> {
    return await this.fileService.getAllFolderFiles(currentUser, folderId);
  }

  @Delete('/id')
  async deleteFile(
    @User() currentUser: UserEntity,
    @Param('id') fileId: string,
  ): Promise<DeleteResult> {
    return await this.fileService.deleteFile(currentUser, fileId);
  }
}
