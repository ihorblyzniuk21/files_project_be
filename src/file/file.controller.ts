import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@app/file/file.service';
import { DeleteResult } from 'typeorm';
import { FileEntity } from '@app/file/file.entity';
import { AuthGuard } from '@app/guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FolderEntity } from '@app/folder/folder.entity';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Creating file. Auth is required' })
  @ApiResponse({ status: 201, type: FolderEntity })
  @Post('/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addFile(
    @User() currentUser: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Param('id') folderId: string,
  ): Promise<FileEntity> {
    return await this.fileService.addFile(file, body, currentUser, folderId);
  }

  @ApiOperation({ summary: 'Getting all files. Auth is required' })
  @ApiResponse({ status: 200, type: FolderEntity })
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getAll(
    @User() currentUser: UserEntity,
    @Param('id') folderId: string,
  ): Promise<FileEntity[]> {
    return await this.fileService.getAllFolderFiles(currentUser, folderId);
  }

  @ApiOperation({ summary: 'Deleting file. Auth is required' })
  @ApiResponse({ status: 200, type: FolderEntity })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteFile(
    @User() currentUser: UserEntity,
    @Param('id') fileId: string,
  ): Promise<DeleteResult> {
    return await this.fileService.deleteFile(currentUser, fileId);
  }
}
