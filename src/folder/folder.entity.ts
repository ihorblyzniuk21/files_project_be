import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FileEntity } from '@app/file/file.entity';

@Entity({ name: 'folders' })
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  public: boolean;

  @ManyToOne(() => UserEntity, (user) => user.folders, { eager: true })
  user: UserEntity;

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];
}
