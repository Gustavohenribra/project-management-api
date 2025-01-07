import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards, SetMetadata } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './projects.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Request, Response } from 'express';
import { PdfService } from '../common/pdf.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly pdfService: PdfService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() project: Partial<Project>, @Req() req: any): Promise<Project> {
    const user = req.user;
    return this.projectsService.create(project, user);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Project> {
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return project;
  }  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin', 'user'])
  @Put(':id')
  async update(@Param('id') id: number, @Body() project: Partial<Project>, @Req() req: any): Promise<void> {
    const user = req.user;
    await this.projectsService.update(id, project, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: any): Promise<void> {
    const user = req.user;
    await this.projectsService.remove(id, user);
  }

  @Get(':id/report')
  async generateReport(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    this.pdfService.generateProjectReport(project, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/members')
  async addMember(@Param('id') projectId: number, @Body('userId') userId: number, @Req() req: any): Promise<void> {
    const user = req.user;
    await this.projectsService.addMember(projectId, userId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/members/:userId')
  async removeMember(@Param('id') projectId: number, @Param('userId') userId: number, @Req() req: any): Promise<void> {
    const user = req.user;
    await this.projectsService.removeMember(projectId, userId, user);
  }

  @Get(':id/logs')
  async getLogs(@Param('id') projectId: number): Promise<any[]> {
    return this.projectsService.getLogs(projectId);
  }
}
