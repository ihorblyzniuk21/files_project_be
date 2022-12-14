import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import ormconfig from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), UserModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
