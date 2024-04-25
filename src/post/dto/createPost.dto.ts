import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
// on peut faire la doc API avec le plugin CLI
export class CreatePostDto{
    @ApiProperty()
    @IsNotEmpty()
    readonly title : string
    @ApiProperty()
    @IsNotEmpty()
    readonly body : string
}