import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FolderEntity } from '@app/folder/folder.entity';
import { FileEntity } from '@app/file/file.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ example: '1', description: 'unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'user@email.com', description: 'user email' })
  @Column()
  email: string;

  @ApiProperty({
    example: 'http://avatar.jpg',
    description: 'user avatar',
  })
  @Column()
  avatar: string;

  @OneToMany(() => FolderEntity, (folder) => folder.user)
  folders: FolderEntity[];

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];
}
