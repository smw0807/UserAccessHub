import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [ConfigModule, PrismaModule, SupabaseModule, GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
