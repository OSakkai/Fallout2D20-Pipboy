import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, username: string, role: 'PLAYER' | 'GM' = 'PLAYER') {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async guestAccess() {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const payload = { sub: guestId, email: 'guest@local', role: 'PLAYER', isGuest: true };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: guestId,
        email: 'guest@local',
        role: 'PLAYER',
        isGuest: true,
      },
    };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isGuest: false,
      },
    };
  }

  async validateUser(userId: string) {
    if (userId.startsWith('guest_')) {
      return {
        id: userId,
        email: 'guest@local',
        username: 'GUEST_USER',
        role: 'PLAYER',
        isGuest: true,
      };
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, role: true },
    });
  }
}
