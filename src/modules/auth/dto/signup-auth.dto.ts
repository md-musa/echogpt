import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignUpAuthDto {
    @ApiProperty({ example: 'Mohammad Musa', minLength: 1 })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'musa.user@gmail.com', format: 'email', minLength: 1 })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}

