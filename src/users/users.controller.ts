import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.params';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { STAFF } from 'src/auth/auth.constants';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(AuthTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(...STAFF)
  @Post('createUser')
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  @Get('findUsers')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('user/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get('me')
  getMe(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.usersService.me(tokenPayload);
  }

  @Patch('user/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUseDto: UpdateUserDto,
  ): Promise<any> {
    return this.usersService.update(id, updateUseDto);
  }

  @Delete('user/:id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.usersService.remove(id);
  }
}
