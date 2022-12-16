import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { Request, Response } from 'express';
import { DeleteResult } from 'typeorm';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(
    @Body('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.login(token);
    response.cookie('refreshToken', res.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res;
  }

  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<DeleteResult> {
    const res = await this.userService.logout(request.cookies.refreshToken);
    response.clearCookie('refreshToken');
    return res;
  }

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
