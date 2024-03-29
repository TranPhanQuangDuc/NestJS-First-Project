import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { UserInformationModule } from './user-information/user-information.module';

@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true}), AuthModule, UserModule, BookmarkModule, PrismaModule, AccountModule, UserInformationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
