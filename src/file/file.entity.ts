import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FolderEntity } from '@app/folder/folder.entity';

@Entity({ name: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  public: boolean;

  @ManyToOne(() => UserEntity, (user) => user.files, { eager: true })
  user: UserEntity;

  @ManyToOne(() => FolderEntity, (folder) => folder.files, { eager: true })
  folder: FolderEntity;
}
