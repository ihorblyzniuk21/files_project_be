import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FolderEntity } from '@app/folder/folder.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'files' })
export class FileEntity {
  @ApiProperty({ example: '1', description: 'unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fileName', description: 'filename' })
  @Column()
  name: string;

  @ApiProperty({ example: 'fileName.jpg', description: 'filepath' })
  @Column()
  path: string;

  @ApiProperty({ example: 'true', description: 'private or public' })
  @Column()
  public: boolean;

  @ManyToOne(() => UserEntity, (user) => user.files, { eager: true })
  user: UserEntity;

  @ManyToOne(() => FolderEntity, (folder) => folder.files, { eager: true })
  folder: FolderEntity;
}
