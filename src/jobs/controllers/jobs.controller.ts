import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobsService } from '../services/jobs.service';

@ApiTags('Jobs')
@Controller({
  path: 'jobs',
  version: '1',
})
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  syncGameWeeks() {
    return this.jobsService.syncGameWeeks();
  }

  @Post()
  create() {
    return this.jobsService.syncGameWeekSchedule('Game-Week', '1', '2');
  }
}
