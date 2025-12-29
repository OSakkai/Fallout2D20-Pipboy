import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('characters')
@UseGuards(JwtAuthGuard)
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.charactersService.create(req.user.id, body);
  }

  @Get()
  async findAll(@Request() req) {
    return this.charactersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.charactersService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.charactersService.delete(id);
  }
}
