import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UpdateSettingsDto } from './dto/settings.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('api/users/:userId')
  @ApiOperation({ summary: 'Get user by ID (matches RN authSlice path)' })
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findById(userId).then((user) =>
      this.usersService.toProfileResponse(user),
    );
  }

  @Get('users/:id/profile')
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id).then((user) =>
      this.usersService.toProfileResponse(user),
    );
  }

  @Patch('users/:id/settings')
  @ApiOperation({ summary: 'Update user settings' })
  updateSettings(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
    @Body() dto: UpdateSettingsDto,
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Cannot update another user\'s settings');
    }
    return this.usersService.updateSettings(id, dto);
  }
}
