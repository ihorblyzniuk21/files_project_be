import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from '@app/folder/folder.service';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateFolderDto } from '@app/folder/dto/createFolder.dto';
import { FolderEntity } from '@app/folder/folder.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@app/guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Folder')
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @ApiOperation({ summary: 'Creating folder. Auth is required' })
  @ApiResponse({ status: 201, type: FolderEntity })
  @Post()
  @UseGuards(AuthGuard)
  async createFolder(
    @User() currentUser: UserEntity,
    @Body() folder: CreateFolderDto,
  ): Promise<FolderEntity> {
    return await this.folderService.createFolder(folder, currentUser);
  }

  @ApiOperation({ summary: 'Getting all folders. Auth is required' })
  @ApiResponse({ status: 200, type: [FolderEntity] })
  @Get()
  @UseGuards(AuthGuard)
  async getAll(@User() currentUser: UserEntity): Promise<FolderEntity[]> {
    return await this.folderService.getAllFolders(currentUser);
  }

  @ApiOperation({ summary: 'Getting one folder. Auth is required' })
  @ApiResponse({ status: 200, type: FolderEntity })
  @Get('/:folderId')
  @UseGuards(AuthGuard)
  async getOne(
    @Param('folderId') folderId: number,
    @User() currentUser: UserEntity,
  ): Promise<FolderEntity> {
    return await this.folderService.getOneFolder(folderId, currentUser);
  }

  @ApiOperation({ summary: 'Updating folder. Auth is required' })
  @ApiResponse({ status: 200, type: FolderEntity })
  @Put('/:folderId')
  @UseGuards(AuthGuard)
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

  @ApiOperation({ summary: 'Deleting folder. Auth is required' })
  @ApiResponse({ status: 200, type: FolderEntity })
  @Delete('/:folderId')
  @UseGuards(AuthGuard)
  async deleteFolder(
    @Param('folderId') folderId: number,
    @User() currentUser: UserEntity,
  ): Promise<DeleteResult> {
    return await this.folderService.deleteFolder(folderId, currentUser);
  }
}
