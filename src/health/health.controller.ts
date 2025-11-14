import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('alive')
  alive() {
    return 'alive';
  }

  @Get('ready')
  ready() {
    return 'ready';
  }
}