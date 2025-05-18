import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignupDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsDate()
    @IsNotEmpty()
    dob: Date;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;


    @IsNotEmpty()
    @IsEmail()
    email: string;
}