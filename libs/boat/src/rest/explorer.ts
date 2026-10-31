import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { ROUTE_NAME } from './constants';
import { HttpMetadata } from './metadata';
import { PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GenericFunction } from '../constants';

@Injectable()
export class HttpExplorer {
  constructor(
    private readonly config: ConfigService,
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    HttpMetadata.setBaseUrl(this.config.get('app.url'));

    const wrappers = this.discovery.getControllers();

    wrappers.forEach((w) => {
      const { instance } = w;
      if (
        !instance ||
        typeof instance === 'string' ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }

      const baseRoute = Reflect.getMetadata(PATH_METADATA, w.metatype);
      for (const key of this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance),
      )) {
        this.lookupListeners(instance, key, baseRoute);
      }
    });
  }

  lookupListeners(
    instance: Record<string, GenericFunction>,
    key: string,
    baseRoute?: string,
  ) {
    baseRoute = baseRoute || '';
    const hasRouteName = Reflect.hasMetadata(ROUTE_NAME, instance, key);
    if (!hasRouteName) return;
    const routeName = Reflect.getMetadata(ROUTE_NAME, instance, key);
    HttpMetadata.addNamedRoute(
      routeName,
      join(baseRoute, Reflect.getMetadata(PATH_METADATA, instance[key])),
    );
  }
}
