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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

type UserRequest = Request & { user: RequestUser };

@Controller('users')
@UseGuards(AccessTokenGuard)
@ApiTags('Users')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'User was not found.' })
  getProfile(@Req() request: UserRequest) {
    return this.usersService.getProfile(request.user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Request is invalid or no name was provided.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'User was not found.' })
  updateProfile(@Req() request: UserRequest, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(request.user.sub, dto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change the current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Request is invalid or the new password is unchanged.' })
  @ApiResponse({ status: 401, description: 'Access token or current password is invalid.' })
  changePassword(@Req() request: UserRequest, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(request.user.sub, dto);
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete the current user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Request validation failed.' })
  @ApiResponse({ status: 401, description: 'Access token or current password is invalid.' })
  deleteAccount(@Req() request: UserRequest, @Body() dto: DeleteAccountDto) {
    return this.usersService.deleteAccount(request.user.sub, dto);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update a user role' })
  @ApiResponse({ status: 200, description: 'User role updated successfully.' })
  @ApiResponse({ status: 400, description: 'Request is invalid or the target is the current user.' })
  @ApiResponse({ status: 401, description: 'Access token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Current user is not an administrator.' })
  @ApiResponse({ status: 404, description: 'User was not found.' })
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
