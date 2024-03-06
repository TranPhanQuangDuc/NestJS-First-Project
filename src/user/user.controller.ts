import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ResetUserPasswordDto, SetPasswordDto, SetPasswordRequestDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }
    @UseGuards(JwtGuard)
    @Patch('resetpassword')
    resetUserPassword(@GetUser() user: User, @Body() dto: ResetUserPasswordDto) {
        return this.userService.resetPassword(user, dto)
    }
    @Patch('setpassword')
    setUserPassword(@Body() dto: SetPasswordDto) {
        return this.userService.setPassword(dto)
    }
    @Patch('setpasswordrequest')
    setPasswordRequest(@Body() dto: SetPasswordRequestDto) {
        return this.userService.setPasswordRequest(dto)
    }
}
 