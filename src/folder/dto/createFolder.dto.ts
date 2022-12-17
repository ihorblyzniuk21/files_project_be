import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ example: 'folder 1', description: 'folder name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'true', description: 'public or private' })
  @IsNotEmpty()
  public: boolean;
}
