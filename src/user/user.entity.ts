import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FolderEntity } from '@app/folder/folder.entity';
import { FileEntity } from '@app/file/file.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @OneToMany(() => FolderEntity, (folder) => folder.user)
  folders: FolderEntity[];

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];
}
