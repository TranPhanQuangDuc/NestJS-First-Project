import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ResetUserPasswordDto, SetPasswordDto, SetPasswordRequestDto } from './dto';
import * as CryptoJS from 'crypto-js';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async resetPassword(user: User, dto: ResetUserPasswordDto) {
        const currentUser = await this.prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });
        if(!currentUser) {
            throw new ForbiddenException('Credentials incorrect')
        }
        console.log({
            dto: dto,
        });
        console.log(currentUser);
        
        const currentPassword = CryptoJS.AES.decrypt(currentUser.hash, "Secret Passphrase").toString(CryptoJS.enc.Utf8);
        if(currentPassword != dto.old) {
            return 'Wrong Password'
        }
        if(dto.new != dto.confirm) {
            return 'New password and the confirmation do not match'
        }
        const newPasswordHash = CryptoJS.AES.encrypt(dto.new, "Secret Passphrase").toString();
        await this.prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                hash: newPasswordHash
            },
        });
        return 'Update Password Successfully'

    }
    async setPassword(dto: SetPasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken : dto.token,
            },
        });
        if(!user) {
            throw new ForbiddenException('Credentials incorrect')
        }
        console.log({
            dto: dto,
        });
        console.log(user);
        if(dto.new != dto.confirm) {
            return 'New password and the confirmation do not match'
        }
        const newPasswordHash = CryptoJS.AES.encrypt(dto.new, "Secret Passphrase").toString();
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                hash: newPasswordHash
            },
        });
        return 'Update Password Successfully'

    }

    async setPasswordRequest(dto: SetPasswordRequestDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if(!user) {
            throw new ForbiddenException('Credentials incorrect')
        }
        const token = CryptoJS.AES.encrypt(dto.email, "Secret Passphrase").toString();
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                resetPasswordToken: token
            }
        });
        return token
    }
}
