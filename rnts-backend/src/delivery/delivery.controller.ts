import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { DeliveryService } from './delivery.service';
import {
  CreateDeliveryOrderDto,
  DriverLocationDto,
  OrderStatusDto,
} from './dto/delivery.dto';

@ApiTags('delivery')
@Public()
@Controller('delivery/orders')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a delivery order' })
  createOrder(@Body() dto: CreateDeliveryOrderDto) {
    return this.deliveryService.createOrder(dto);
  }

  @Get(':orderId/tracking')
  @ApiOperation({ summary: 'Get order tracking info' })
  getTracking(@Param('orderId') orderId: string) {
    return this.deliveryService.getTracking(orderId);
  }

  @Post(':orderId/driver-location')
  @ApiOperation({ summary: 'Update driver location' })
  postDriverLocation(
    @Param('orderId') orderId: string,
    @Body() dto: DriverLocationDto,
  ) {
    return this.deliveryService.postDriverLocation(orderId, dto);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(
    @Param('orderId') orderId: string,
    @Body() dto: OrderStatusDto,
  ) {
    return this.deliveryService.updateStatus(orderId, dto);
  }

  @Post(':orderId/accept')
  @ApiOperation({ summary: 'Accept order as driver' })
  acceptOrder(@Param('orderId') orderId: string) {
    return this.deliveryService.acceptOrder(orderId);
  }

  @Post(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  cancelOrder(@Param('orderId') orderId: string) {
    return this.deliveryService.cancelOrder(orderId);
  }
}
