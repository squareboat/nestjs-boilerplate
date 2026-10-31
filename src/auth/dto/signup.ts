import { IsDateString, IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { IsPassword } from "./password";


export class SignupDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    last_name: string;

    // a calendar date such as 1990-05-01 (stored in a DATE column)
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'dob must be a date like 1990-05-01' })
    @IsDateString({ strict: true })
    dob: string;

    @IsPassword()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    username: string;


    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    email: string;
}