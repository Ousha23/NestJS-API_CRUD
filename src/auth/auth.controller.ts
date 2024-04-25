import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('reset-password')
  resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto) {
    return this.authService.resetPasswordDemand(resetPasswordDemandDto);
  }

  @Post('reset-password-confirmation')
  resetPasswordConfirmation(
    @Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    return this.authService.resetPasswordConfirmation(
      resetPasswordConfirmationDto,
    );
  }

  // pour supprimer un compte (implementer le decryptage du token JWT/ un utilisateur doit etre connecter poour pouvoir supp son compte (on cée un fichier stategy.service.ts ))
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) // permet de proteger les routes
  @Delete('delete')
  deleteAccount(
    @Req() request: Request,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    // utilisation d une requete @Req pr la supp du user
    const userId = request.user['userId'];
    return this.authService.deleteAccount(userId, deleteAccountDto);
  }
}
