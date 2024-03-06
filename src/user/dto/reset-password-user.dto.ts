import { IsNotEmpty, IsString } from "class-validator";

export class ResetUserPasswordDto {
    @IsString()
    @IsNotEmpty()
    old: string;

    @IsString()
    @IsNotEmpty()
    new: string;

    @IsString()
    @IsNotEmpty()
    confirm: string;
}