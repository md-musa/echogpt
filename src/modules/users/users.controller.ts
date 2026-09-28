import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

type UserRequest = Request & { user: RequestUser };

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  getProfile(@Req() request: UserRequest) {
    return this.usersService.getProfile(request.user.sub);
  }

  @Patch('profile')
  updateProfile(@Req() request: UserRequest, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(request.user.sub, dto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Req() request: UserRequest, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(request.user.sub, dto);
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  deleteAccount(@Req() request: UserRequest, @Body() dto: DeleteAccountDto) {
    return this.usersService.deleteAccount(request.user.sub, dto);
  }

  @Patch(':id/role')
  updateRole(
    @Req() request: UserRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    if (request.user.sub === id) {
      throw new BadRequestException('You cannot change your own role');
    }
    return this.usersService.updateRole(request.user.sub, id, dto.role);
  }
}
