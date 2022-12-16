import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FolderEntity } from '@app/folder/folder.entity';
import { Repository } from 'typeorm';
import { CreateFolderDto } from '@app/folder/dto/createFolder.dto';
import { UserEntity } from '@app/user/user.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}
  async createFolder(
    folder: CreateFolderDto,
    currentUser: UserEntity,
  ): Promise<FolderEntity> {
    const newFolder = new FolderEntity();
    Object.assign(newFolder, folder);

    newFolder.user = currentUser;

    return await this.folderRepository.save(newFolder);
  }

  async getAllFolders(currentUser: UserEntity): Promise<FolderEntity[]> {
    const folders = await this.folderRepository.find({
      where: { user: currentUser },
    });
    return folders;
  }

  async getOneFolder(
    folderId: number,
    currentUser: UserEntity,
  ): Promise<FolderEntity> {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['files'],
      select: ['id', 'name', 'public', 'user', 'files'],
    });

    if (!folder.public) {
      if (folder.user.id === currentUser.id) {
        return folder;
      } else {
        throw new HttpException('You have no access', HttpStatus.FORBIDDEN);
      }
    }

    if (folder.public) {
      return folder;
    }
  }

  async updateFolder(
    folderId: number,
    currentUser: UserEntity,
    folderBody: CreateFolderDto,
  ): Promise<FolderEntity> {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });
    if (folder.user.id !== currentUser.id) {
      throw new HttpException(
        'You have no access to change folder',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(folder, folderBody);
    return await this.folderRepository.save(folder);
  }

  async deleteFolder(folderId: number, currentUser: UserEntity) {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });

    if (folder.user.id !== currentUser.id) {
      throw new HttpException(
        'You have no access to delete folder',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.folderRepository.delete({ id: folderId });
  }
}
