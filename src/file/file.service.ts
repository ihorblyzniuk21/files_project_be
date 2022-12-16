import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { FileEntity } from '@app/file/file.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FolderEntity } from '@app/folder/folder.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}

  async addFile(
    file,
    body,
    currentUser: UserEntity,
    folderId,
  ): Promise<FileEntity> {
    try {
      const extension = file.originalname.split('.')[1];
      const originalName = file.originalname.split('.')[0];
      const fileName = uuid.v4() + '.' + extension;
      const filePath = path.resolve(__dirname, '..', 'public');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      const folder = await this.folderRepository.findOne({
        where: { id: folderId },
      });
      const data = {
        name: originalName,
        path: fileName,
        public: body.public || false,
      };

      const newFile = new FileEntity();
      Object.assign(newFile, data);

      newFile.user = currentUser;
      newFile.folder = folder;

      return await this.fileRepository.save(newFile);
    } catch (e) {
      throw new HttpException(
        'Error with file upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllFolderFiles(currentUser: UserEntity, folderId) {
    try {
      const folder = await this.folderRepository.findOne({
        where: { id: folderId },
      });
      const files = await this.fileRepository.find({
        where: { folder },
      });
      return files;
    } catch (e) {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(currentUser: UserEntity, fileId) {
    const file = await this.fileRepository.findOne({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      throw new HttpException(
        'file not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.fileRepository.delete({ id: fileId });
  }
}
