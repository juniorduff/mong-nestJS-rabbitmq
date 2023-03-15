import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

class UserDto {
  id: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  avatar_url: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  created_at: Date;
}
export { UserDto };
