import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepository: Repository<ChatMessage>,
  ) {}

  async saveMessage(user: string, text: string): Promise<ChatMessage> {
    const message = this.chatRepository.create({ user, text });
    return this.chatRepository.save(message);
  }

  async getRecentMessages(limit = 50): Promise<ChatMessage[]> {
    return this.chatRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
