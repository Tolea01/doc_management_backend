import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import ApiLanguageHeader from 'app/common/decorators/swagger/language-header';
import { UserRole } from '../user/roles/role.enum';
import { ChatService } from './chat.service';

@ApiTags('Messages')
@ApiLanguageHeader()
@ApiBearerAuth()
@Role(UserRole.ALL)
@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('recent')
  getRecentMessages(@Query('limit') limit = 50) {
    return this.chatService.getRecentMessages(+limit);
  }
}
