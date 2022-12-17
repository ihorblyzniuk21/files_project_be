import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { Request, Response } from 'express';
import { DeleteResult } from 'typeorm';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Creating user' })
  @ApiResponse({ status: 201, type: UserEntity })
  @Post('/login')
  async login(
    @Body('token') token: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.login(token);
    response.cookie('refreshToken', res.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res;
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<DeleteResult> {
    const res = await this.userService.logout(request.cookies.refreshToken);
    response.clearCookie('refreshToken');
    return res;
  }

  @ApiOperation({ summary: 'Refresh user tokens' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.refresh(
      request.cookies.refreshToken,
      response,
    );
    response.cookie('refreshToken', res.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res;
  }
}
