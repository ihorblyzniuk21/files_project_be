import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'eyJhbL...ZvMXuM',
    description: 'Token from google account',
  })
  @IsNotEmpty()
  token: string;
}
