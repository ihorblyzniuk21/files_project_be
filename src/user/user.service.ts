import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { TokenService } from '@app/token/token.service';
import { GenerateTokenInterface } from '@app/token/types/generateToken.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(token: string): Promise<UserResponseInterface> {
    const decodedUser = jwt.decode(token);
    const user = {
      name: decodedUser.name,
      email: decodedUser.email,
      avatar: decodedUser.picture,
    };

    const userFromDB = await this.getUserByEmail(user);

    if (userFromDB) {
      throw new HttpException(
        'user with this email already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, user);
    const savedUser = await this.userRepository.save(newUser);

    const tokens = await this.tokenService.generateTokens({ ...savedUser });
    await this.tokenService.saveToken({ ...savedUser }, tokens.refreshToken);

    return this.buildUserResponse(savedUser, tokens);
  }

  async getUserByEmail(user) {
    if (!user) {
      throw new HttpException(
        'data is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.userRepository.findOne({
      where: { email: user.email },
      select: ['id', 'email', 'name', 'avatar'],
      relations: ['roles'],
    });
  }

  buildUserResponse(
    user: UserEntity,
    tokens: GenerateTokenInterface,
  ): UserResponseInterface {
    return {
      user,
      tokens,
    };
  }
}
