import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  wallet_address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}
