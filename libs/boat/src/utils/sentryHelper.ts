import * as Sentry from '@sentry/node';

export class SentryHelper {
  static sendCustomLogs(
    msg: string,
    extrasInfo: Record<string, any> = {},
    level: Sentry.SeverityLevel = 'debug',
  ): void {
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      scope.setExtras(extrasInfo);
      Sentry.captureMessage(msg);
    });
  }
}
