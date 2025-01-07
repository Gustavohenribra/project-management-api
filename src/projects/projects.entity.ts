import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ default: 'in_progress' })
  status!: 'in_progress' | 'completed';

  @ManyToOne(() => User, (user) => user.projects, { eager: true, onDelete: 'CASCADE' })
  owner!: User;
  
  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  members!: User[];  
}
