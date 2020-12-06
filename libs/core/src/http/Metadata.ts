import * as queryString from 'query-string';

export class HttpMetadata {
  static store: Record<string, any> = { routes: {}, baseUrl: '' };

  static addNamedRoute(routeName: string, path: string): void {
    HttpMetadata.store.routes[routeName] = path;
  }

  static getRoute(routeName: string, params?: Object): string {
    let route = HttpMetadata.store.routes[routeName];
    if (!route) return null;

    let notPathParams = null;
    if (params && Object.keys(params).length) {
      notPathParams = {};
      for (const key in params) {
        route.includes(`:${key}`)
          ? (route = route.replace(`:${key}`, params[key]))
          : (notPathParams[key] = params[key]);
      }
    }
    const url = new URL(
      notPathParams
        ? `${route}?${queryString.stringify(notPathParams)}`
        : route,
      HttpMetadata.store.baseUrl,
    );

    return url.href;
  }

  static setBaseUrl(url: string): void {
    HttpMetadata.store.baseUrl = url;
  }
}
