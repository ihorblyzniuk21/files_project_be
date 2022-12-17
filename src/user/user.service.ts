import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { decode } from 'jsonwebtoken';
import { TokenService } from '@app/token/token.service';
import { GenerateTokenInterface } from '@app/token/types/generateToken.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { CreateUserDto } from '@app/user/dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tokenService: TokenService,
  ) {}

  async login(token: CreateUserDto): Promise<UserResponseInterface> {
    const decodedUser = decode(token);
    const user = {
      name: decodedUser.name,
      email: decodedUser.email,
      avatar: decodedUser.picture,
    };

    const userFromDB = await this.getUserByEmail(user);

    if (userFromDB) {
      const tokens = await this.tokenService.generateTokens({ ...userFromDB });
      await this.tokenService.saveToken({ ...userFromDB }, tokens.refreshToken);

      return this.buildUserResponse(userFromDB, tokens);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, user);
    const savedUser = await this.userRepository.save(newUser);

    const tokens = await this.tokenService.generateTokens({ ...savedUser });
    await this.tokenService.saveToken({ ...savedUser }, tokens.refreshToken);

    return this.buildUserResponse(savedUser, tokens);
  }

  async logout(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken);
  }

  async deleteUser(email: string): Promise<DeleteResult> {
    const userFromDB = await this.getUserByEmail({ email });

    if (!userFromDB) {
      throw new HttpException('User doesnt exists', HttpStatus.NOT_FOUND);
    }

    return await this.userRepository.delete({ email });
  }

  async refresh(
    refreshToken: string,
    response,
  ): Promise<UserResponseInterface> {
    if (!refreshToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.findTokenByUserId(userData);

    if (!userData || !tokenFromDB) {
      response.clearCookie('refreshToken');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const userByEmail = await this.getUserByEmail(userData);

    const tokens = await this.tokenService.generateTokens({ ...userByEmail });
    await this.tokenService.saveToken({ ...userByEmail }, tokens.refreshToken);

    return this.buildUserResponse(userByEmail, tokens);
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
