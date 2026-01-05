import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema com email, nome de usuário e senha'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@vault.com' },
        username: { type: 'string', example: 'vault_dweller', minLength: 3 },
        password: { type: 'string', example: '123456', minLength: 6 },
        role: { type: 'string', enum: ['PLAYER', 'GM'], default: 'PLAYER' }
      },
      required: ['email', 'username', 'password']
    }
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso. Retorna token JWT.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou email/username já cadastrado.' })
  async register(@Body() body: { email: string; username: string; password: string; role?: 'PLAYER' | 'GM' }) {
    return this.authService.register(body.email, body.password, body.username, body.role);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fazer login',
    description: 'Autentica usuário com email e senha, retornando token JWT'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@vault.com' },
        password: { type: 'string', example: '123456' }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido. Retorna token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('guest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Acesso como convidado',
    description: 'Gera token JWT temporário para acesso sem cadastro (modo local)'
  })
  @ApiResponse({
    status: 200,
    description: 'Token de convidado gerado. Sem salvamento na nuvem.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', example: 'guest@local' },
            role: { type: 'string', example: 'PLAYER' },
            isGuest: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  async guestAccess() {
    return this.authService.guestAccess();
  }
}
