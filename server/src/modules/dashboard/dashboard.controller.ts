import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('daily-leads')
  async getDailyLeads() {
    return await this.dashboardService.getDailyLeads();
  }

  @Get('metrics')
  async getDashboardMetrics() {
    return await this.dashboardService.getDashboardData();
  }
}
