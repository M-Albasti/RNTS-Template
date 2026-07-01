import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type DeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

@Entity('delivery_orders')
export class DeliveryOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'pending' })
  status: DeliveryStatus;

  @Column()
  pickupId: string;

  @Column()
  dropoffId: string;

  @Column()
  packageType: string;

  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  @Column('real')
  price: number;

  @Column('integer')
  etaMinutes: number;

  @Column('simple-json')
  timeline: Array<{
    id: string;
    status: DeliveryStatus;
    label: string;
    timestamp: string;
  }>;

  @Column('simple-json', { nullable: true })
  driver: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    latitude: number;
    longitude: number;
  } | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const SEED_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Home',
    addressLine: '123 Main St, Cairo',
    coordinate: { latitude: 30.0444, longitude: 31.2357 },
  },
  {
    id: 'addr-2',
    label: 'Office',
    addressLine: '456 Nile Rd, Giza',
    coordinate: { latitude: 30.0131, longitude: 31.2089 },
  },
  {
    id: 'addr-3',
    label: 'Mall',
    addressLine: '789 Shopping Ave, Cairo',
    coordinate: { latitude: 30.0626, longitude: 31.2497 },
  },
];
