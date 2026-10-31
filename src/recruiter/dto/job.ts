// every field is a VARCHAR(255) column
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class JobDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;

    @IsString()
    @MaxLength(255)
    description: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    location: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    skills: string;
}