import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './projects.entity';
import { User } from '../users/users.entity';
import { ActivityLog } from './activity-log.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async create(project: Partial<Project>, owner: User): Promise<Project> {
    const projectData = this.projectsRepository.create({ ...project, owner });
    const savedProject = await this.projectsRepository.save(projectData);
    await this.logActivity(savedProject, owner, 'Project created');
    return savedProject;
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({ relations: ['owner', 'members'] });
  }

  async findOne(id: number): Promise<Project | undefined> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'members'],
    });
    return project || undefined;
  }
  
  async update(id: number, project: Partial<Project>, user: User): Promise<void> {
    const existingProject = await this.findOne(id);
    if (!existingProject) {
      throw new Error('Project not found');
    }
  
    if (existingProject.owner.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this project');
    }
  
    await this.projectsRepository.update(id, project);
    await this.logActivity(existingProject, user, 'Project updated');
  }  

  async remove(id: number, user: User): Promise<void> {
    const existingProject = await this.findOne(id);
    if (!existingProject) {
      throw new Error('Project not found');
    }
  
    if (existingProject.owner.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this project');
    }
  
    await this.activityLogRepository.delete({ project: existingProject });
    existingProject.members = [];
    await this.projectsRepository.save(existingProject);
  
    await this.projectsRepository.delete(id);
  }    

  async addMember(projectId: number, userId: number, owner: User): Promise<void> {
    const project = await this.findOne(projectId);
    if (!project) throw new Error('Project not found');
    if (project.owner.id !== owner.id) throw new ForbiddenException('Only the owner can add members');

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    project.members.push(user);
    await this.projectsRepository.save(project);
    await this.logActivity(project, owner, `User ${user.name} added to project`);
  }

  async removeMember(projectId: number, userId: number, owner: User): Promise<void> {
    const project = await this.findOne(projectId);
    if (!project) throw new Error('Project not found');
    if (project.owner.id !== owner.id) throw new ForbiddenException('Only the owner can remove members');

    project.members = project.members.filter((member) => member.id !== userId);
    await this.projectsRepository.save(project);
    await this.logActivity(project, owner, `User ${userId} removed from project`);
  }

  async logActivity(project: Project, user: User, action: string): Promise<void> {
    const log = this.activityLogRepository.create({ project, user, action });
    await this.activityLogRepository.save(log);
  }

  async getLogs(projectId: number): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { project: { id: projectId } },
      order: { timestamp: 'DESC' },
    });
  }
}
