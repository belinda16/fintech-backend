import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance!: number;

  @OneToOne(() => User, user => user.wallet)
  user!: User;
}
