import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Project } from '../projects/projects.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @OneToMany(() => Project, (project) => project.owner, { cascade: true })
  projects!: Project[];
  
  @ManyToMany(() => Project, (project) => project.members)
  @JoinTable()
  projectMemberships!: Project[];
  
}
