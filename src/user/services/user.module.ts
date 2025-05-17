import { Module } from "@nestjs/common";
import { UserService } from "./user";

@Module({
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }