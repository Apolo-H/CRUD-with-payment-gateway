import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginDto } from './create-auth.dto';

export class UpdateLoginDto extends PartialType(CreateLoginDto) {}
