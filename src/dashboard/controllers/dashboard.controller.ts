import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('dashboard')
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get('users-per-month')
  getUsersCreatedByMonth() {
    return this.dashboardService.getUsersCreatedByMonth();
  }
}
