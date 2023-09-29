import { Controller, HttpCode, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(200)
  SeedDB() {
    return this.seedService.executeSeed();
  }
}
