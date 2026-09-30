import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('daily-leads')
  @UseGuards(JwtAuthGuard)
  async getDailyLeads() {
    return await this.dashboardService.getDailyLeads();
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard)
  async getDashboardMetrics() {
    return await this.dashboardService.getDashboardData();
  }
}
