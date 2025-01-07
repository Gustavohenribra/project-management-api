import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  @Post()
  create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<void> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
