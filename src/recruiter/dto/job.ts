import { IsNotEmpty, IsString } from "class-validator";

export class JobDTO {
   
    @IsNotEmpty()
    user_id:BigInteger

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsString()
    skills: string;
}