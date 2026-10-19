import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column('simple-array')
    technologies: string[];

    @Column({ nullable: true })
    githubUrl: string;

    @Column({ nullable: true })
    demoUrl: string;

    @Column({ default: false })
    featured: boolean;

    @Column({ default: 0 })
    order: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
