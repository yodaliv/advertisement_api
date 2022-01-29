import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class SearchBarDto {
  @ApiProperty()
  readonly id: string;
  
  @ApiProperty()
  readonly date: string;

  @ApiProperty()
  readonly network: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly link: string;

  @ApiProperty()
  readonly creator: User;

  @ApiProperty()
  readonly credits: number;
}