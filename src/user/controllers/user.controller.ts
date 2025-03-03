import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '../entities/role.enum';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('count-per-month')
  async getUserCountPerMonth() {
    return this.userService.getUsersOverview();
  }
  @Get()
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Filter teams by query',
  })
  findAll(
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('query', new DefaultValuePipe('')) search?: string,
  ) {
    return this.userService.findAll(search, size, page, 'user');
  }

  @Get('/admin')
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Filter teams by query',
  })
  findAllAdmin(
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('query', new DefaultValuePipe('')) search?: string,
  ) {
    return this.userService.findAll(search, size, page, 'admin');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}
