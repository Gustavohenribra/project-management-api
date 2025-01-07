import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './projects.entity';
import { UsersModule } from '../users/users.module';
import { PdfService } from '../common/pdf.service';
import { ActivityLog } from './activity-log.entity';

@Module({
  imports: [    TypeOrmModule.forFeature([Project, ActivityLog]),
  UsersModule,],
  providers: [ProjectsService, PdfService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}