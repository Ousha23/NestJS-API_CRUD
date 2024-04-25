import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/signinDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import * as speakeasy from 'speakeasy';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { DeleteAccountDto } from './dto/deleteAccountDto';

// pour faire un CRUD on utilisera Prisma npm install @prisma/client
// on crée un mo prisma et s prisma pour nous permettre d'intéragir avc la bdd
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: MailerService,
    private readonly JwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    //verif si l user exist
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    // comparer le password
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Password does not match');
    //retour token jwt (protege l endpoint API) npm install --save @nestjs/jwt passport-jwt et npm install --save-dev @types/passport-jwt
    const playload = {
      sub: user.userId,
      email: user.email,
    };
    // la secrete key à mettre dans la variable d env
    const token = this.JwtService.sign(playload, {
      expiresIn: '2h',
      secret: this.configService.get('SECRET_KEY'),
    });
    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  // il faut rendre le module prisma global
  async signup(signupDto: SignupDto) {
    const { email, password, username } = signupDto;
    // vérifier si l'utilisateur existe déja
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('user already exists');
    // hasher le mot de passe (il faut installer bcrypt : npm i bcrypt et les déc de type npm i -D @types/bcrypt)
    const hash = await bcrypt.hash(password, 10);
    // enregistrer l'user dans la BDD
    await this.prismaService.user.create({
      data: { email, username, password: hash },
    });
    // envoyer un email au user (on crée un service qui se chargera de l envoi de mail + un serveur en local pr l envoi de mail: npm i nodemailer + npm i -D @types/nodemailer puis lancer mailhog (https://github.com/mailhog/MailHog pour l install))
    await this.emailService.sendSignupConfirmation(email);
    // retourner une rep succès
    return { data: 'user successfully created' };
  }

  async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
    const { email } = resetPasswordDemandDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    //envoyer un code pr la réinitialisation du mot de pass (on utilisera une librairie : npm i speakeasy + npm i -D @types/speakeasy)
    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15, // c'est en seconde
      encoding: 'base32',
    });
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.emailService.sendResetPassword(email, url, code);
    return { data: 'Reset password mail has been sent' };
  }
  async resetPasswordConfirmation(
    resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    const { email, password, code } = resetPasswordConfirmationDto;
    //verif si l user exist
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    // comparer le code
    const match = speakeasy.totp.verify({
      secret: this.configService.get('OTP_CODE'),
      token: code,
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    if (!match) throw new UnauthorizedException('Invalid/expired token');
    const hash = await bcrypt.hash(password, 10);
    await this.prismaService.user.update({
      where: { email },
      data: { password: hash },
    });
    await this.emailService.sendResetPasswordConfirmation(email);
    return {
      data: 'Password Updated',
    };
  }
  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    const {password} = deleteAccountDto;
    const user = await this.prismaService.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Password does not match');
    
    await this.prismaService.user.delete({where : {userId}})
    return {data : "user deleted"}
  }
}
