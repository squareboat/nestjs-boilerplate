import { IncomingHttpHeaders } from 'http';

export * from './transformer';

export interface ArgumentOptionObject {
  name: string;
  isRequired: boolean;
  isArray: boolean;
  defaultValue: string | boolean;
  expression: string;
}

export interface ArgumentParserOutput {
  name: string;
  arguments: ArgumentOptionObject[];
  options: ArgumentOptionObject[];
}

export interface TimebasedRefId {
  len?: number;
  prefix?: string;
}

export interface CustomHeaders extends IncomingHttpHeaders {
  timezone: string;
  deviceHash: string;
  appVersion: string;
  deviceLang: string;
  platformClient: string;
  deviceClient: string;
  countryCode: string;
}
