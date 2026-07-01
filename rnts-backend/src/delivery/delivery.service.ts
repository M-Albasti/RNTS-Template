import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateDeliveryOrderDto,
  DriverLocationDto,
  OrderStatusDto,
} from './dto/delivery.dto';
import {
  DeliveryOrder,
  DeliveryStatus,
  SEED_ADDRESSES,
} from './entities/delivery-order.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly ordersRepository: Repository<DeliveryOrder>,
  ) {}

  private nowIso() {
    return new Date().toISOString();
  }

  private findAddress(addressId: string) {
    return SEED_ADDRESSES.find((a) => a.id === addressId);
  }

  private toTrackingDto(order: DeliveryOrder) {
    return {
      orderId: order.id,
      status: order.status,
      etaMinutes: order.etaMinutes,
      timeline: order.timeline,
      updatedAt: this.nowIso(),
      driver: order.driver
        ? {
            ...order.driver,
            locationUpdatedAt: this.nowIso(),
          }
        : undefined,
    };
  }

  private appendTimeline(
    order: DeliveryOrder,
    status: DeliveryStatus,
    label: string,
  ) {
    order.status = status;
    order.timeline.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status,
      label,
      timestamp: this.nowIso(),
    });
    if (status === 'delivered') {
      order.etaMinutes = 0;
    }
  }

  async getOrder(orderId: string): Promise<DeliveryOrder> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async createOrder(dto: CreateDeliveryOrderDto) {
    const pickup = this.findAddress(dto.pickupId);
    const dropoff = this.findAddress(dto.dropoffId);

    if (!pickup || !dropoff || pickup.id === dropoff.id) {
      throw new BadRequestException('Invalid pickup or dropoff');
    }

    const order = this.ordersRepository.create({
      status: 'pending',
      pickupId: dto.pickupId,
      dropoffId: dto.dropoffId,
      packageType: dto.packageType,
      notes: dto.notes ?? null,
      price: dto.price,
      etaMinutes: dto.etaMinutes,
      timeline: [
        {
          id: `${Date.now()}-pending`,
          status: 'pending',
          label: 'Order placed',
          timestamp: this.nowIso(),
        },
      ],
      driver: null,
    });

    await this.ordersRepository.save(order);
    return this.toTrackingDto(order);
  }

  async getTracking(orderId: string) {
    const order = await this.getOrder(orderId);
    return this.toTrackingDto(order);
  }

  async postDriverLocation(orderId: string, dto: DriverLocationDto) {
    const order = await this.getOrder(orderId);
    if (!order.driver) {
      throw new BadRequestException('No driver assigned to this order');
    }
    order.driver = {
      ...order.driver,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };
    await this.ordersRepository.save(order);
    return {
      orderId: order.id,
      recordedAt: dto.recordedAt ?? this.nowIso(),
    };
  }

  async updateStatus(orderId: string, dto: OrderStatusDto) {
    const order = await this.getOrder(orderId);
    this.appendTimeline(order, dto.status, dto.label);
    await this.ordersRepository.save(order);
    return this.toTrackingDto(order);
  }

  async acceptOrder(orderId: string) {
    const order = await this.getOrder(orderId);
    if (order.status !== 'pending') {
      throw new BadRequestException('Order cannot be accepted');
    }

    order.driver = {
      id: 'driver-1',
      name: 'Ahmed Hassan',
      phone: '+201234567890',
      rating: 4.8,
      vehicle: 'Motorcycle - ABC 123',
      latitude: 30.05,
      longitude: 31.24,
    };
    this.appendTimeline(order, 'accepted', 'Driver accepted the order');
    await this.ordersRepository.save(order);
    return this.toTrackingDto(order);
  }

  async cancelOrder(orderId: string) {
    const order = await this.getOrder(orderId);
    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new BadRequestException('Order cannot be cancelled');
    }
    this.appendTimeline(order, 'cancelled', 'Order cancelled');
    order.driver = null;
    await this.ordersRepository.save(order);
    return this.toTrackingDto(order);
  }
}
