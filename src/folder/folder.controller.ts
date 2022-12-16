import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FolderService } from '@app/folder/folder.service';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateFolderDto } from '@app/folder/dto/createFolder.dto';
import { FolderEntity } from '@app/folder/folder.entity';
import { DeleteResult } from 'typeorm';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  async createFolder(
    @User() currentUser: UserEntity,
    @Body() folder: CreateFolderDto,
  ): Promise<FolderEntity> {
    return await this.folderService.createFolder(folder, currentUser);
  }

  @Get()
  async getAll(@User() currentUser: UserEntity): Promise<FolderEntity[]> {
    return await this.folderService.getAllFolders(currentUser);
  }

  @Get('/:folderId')
  async getOne(
    @Param('folderId') folderId: number,
    @User() currentUser: UserEntity,
  ): Promise<FolderEntity> {
    return await this.folderService.getOneFolder(folderId, currentUser);
  }

  @Put('/:folderId')
  async updateFolder(
    @Param('folderId') folderId: number,
    @User() currentUser: UserEntity,
    @Body() folderBody: CreateFolderDto,
  ): Promise<FolderEntity> {
    return await this.folderService.updateFolder(
      folderId,
      currentUser,
      folderBody,
    );
  }

  @Delete('/:folderId')
  async deleteFolder(
    @Param('folderId') folderId: number,
    @User() currentUser: UserEntity,
  ): Promise<DeleteResult> {
    return await this.folderService.deleteFolder(folderId, currentUser);
  }
}
