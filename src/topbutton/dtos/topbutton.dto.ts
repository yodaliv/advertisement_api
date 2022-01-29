import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { TopButtonType } from '../enums/topbutton.enum';

export class TopButtonDto {
  @ApiProperty()
  readonly id: string;
  
  @ApiProperty()
  readonly date: string;

  @ApiProperty()
  readonly type: TopButtonType;

  @ApiProperty()
  readonly text: string;

  @ApiProperty()
  readonly link: string;

  @ApiProperty()
  readonly creator: User;

  @ApiProperty()
  readonly credits: number;
}