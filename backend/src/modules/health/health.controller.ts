import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma-health.indicator';

@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  /** Full health check — DB + memory. */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024), // 256 MB
    ]);
  }

  /** Readiness probe — is the database connected? */
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
    ]);
  }

  /** Liveness probe — is the process running? */
  @Get('live')
  live() {
    return { status: 'ok' };
  }
}
