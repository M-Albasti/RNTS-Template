import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getStats() {
    return this.dashboardService.getStats();
  }
}
