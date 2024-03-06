import { IsEmail, IsNotEmpty } from "class-validator"

export class SetPasswordRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
}