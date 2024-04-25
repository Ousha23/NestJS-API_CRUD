// il faut installer npm i --save class-validator class-transformer pour faire des contrôles de données

//NB : il faut pas oublier d'activer la validation (soit de maniere local ou globale(main.ts) )
import { IsNotEmpty, IsEmail } from "class-validator"
export class SignupDto {
    @IsNotEmpty()
    readonly username : string
    @IsEmail()
    readonly email : string
    @IsNotEmpty()
    readonly password : string
}
