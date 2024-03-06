import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as CryptoJS from 'crypto-js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}
    login() {
        return {msg: 'I have signed up'}
    }

    async signup(dto: AuthDto) {
        console.log(dto);
        
        const hash = CryptoJS.AES.encrypt(dto.password, "Secret Passphrase").toString();
        // console.log(hash);
        
        try {
            console.log('1');
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                }
            })
            console.log('2');
            return this.signToken(user.id, user.email)
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
        }
        
    }
    async signin(dto: AuthDto) {
        console.log(dto);
        
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        console.log('1');
        
        if(!user) {
            throw new ForbiddenException('Credentials incorrect')
        }
        console.log('2');
        const password = CryptoJS.AES.decrypt(user.hash, "Secret Passphrase").toString(CryptoJS.enc.Utf8);
        console.log(password);
        
        if(password != dto.password) {
            throw new ForbiddenException('Credentials incorrect')
        }
        console.log('4');
        return this.signToken(user.id, user.email)
    }

    async signToken(
        userId: number,
        email: string,
    ): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email,
        }
        const secret = this.config.get('JWT_SECRET')
        
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        })
        return {
            access_token: token,
        }
    }
}