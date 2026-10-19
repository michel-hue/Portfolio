import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
} from 'typeorm';

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    bio: string;

    @Column({ nullable: true })
    avatar: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    github: string;

    @Column({ nullable: true })
    linkedin: string;

    @Column({ nullable: true })
    twitter: string;

    @Column({ nullable: true })
    location: string;

    @UpdateDateColumn()
    updatedAt: Date;
}
