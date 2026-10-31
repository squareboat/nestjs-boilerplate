import { IsDateString, IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { IsPassword } from "./password";


export class SignupDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    // a calendar date such as 1990-05-01 (stored in a DATE column)
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'dob must be a date like 1990-05-01' })
    @IsDateString({ strict: true })
    dob: string;

    @IsPassword()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;


    @IsNotEmpty()
    @IsEmail()
    email: string;
}