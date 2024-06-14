import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { TransactionType } from './enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;


  @Column()
  transactionType!: TransactionType;

  @Column()
  timestamp!: Date;

  @ManyToOne(() => User, (user: User) => user)
  sender!: User;

  @ManyToOne(() => User, (user: User) => user)
  recipient!: User;

  @Column({ unique: true })
  idempotencyKey!: string;
}
