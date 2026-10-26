import { Controller } from '@nestjs/common';
import { AppMailService } from './app-mail.service';

@Controller('app-mail')
export class AppMailController {
  constructor(private readonly appMailService: AppMailService) {}
}
