import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FileEntity } from '@app/file/file.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'folders' })
export class FolderEntity {
  @ApiProperty({ example: '1', description: 'unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Folder 1', description: 'folder name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'true', description: 'public or private' })
  @Column()
  public: boolean;

  @ManyToOne(() => UserEntity, (user) => user.folders, { eager: true })
  user: UserEntity;

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];
}
