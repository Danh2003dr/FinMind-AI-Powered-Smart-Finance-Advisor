import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsString, MaxLength, ValidateNested } from 'class-validator';

export class ChatTurnDto {
  @IsIn(['user', 'assistant'])
  role!: 'user' | 'assistant';

  @IsString()
  @MaxLength(12000)
  content!: string;
}

export class AdvisorChatDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ChatTurnDto)
  messages!: ChatTurnDto[];
}
