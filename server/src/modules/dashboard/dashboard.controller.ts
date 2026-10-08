import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { WorkspaceGuard } from 'src/common/guards/workspace.guard';
import { CurrentWorkspaceId } from 'src/common/decorators/current-workspace.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('daily-leads')
  @UseGuards(WorkspaceGuard)
  async getDailyLeads(@CurrentWorkspaceId() workspaceId: string) {
    return await this.dashboardService.getDailyLeads(workspaceId);
  }

  @Get('metrics')
  @UseGuards(WorkspaceGuard)
  async getDashboardMetrics(@CurrentWorkspaceId() workspaceId: string) {
    return await this.dashboardService.getDashboardData(workspaceId);
  }
}
