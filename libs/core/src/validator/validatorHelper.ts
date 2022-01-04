export class ValidatorHelper {
    
    resolveContext(condition: Record<string, any>, context: Record<string, any>) {
      const where = { ...condition };
      for (let key in where) {
        let value = where[key];
        if (typeof value != 'string') continue;
        if (!value.includes('$.')) continue;
        let path = value.split('$.')[1];
        where[key] = this.getDeepValue({ ...context }, path);
      }
      return where;
    }
   
    getDeepValue(obj, path) {
      path = path.split('.');
      for (let i = 0, len = path.length; i < len; i++) {
        obj = obj[path[i]];
      }
      return obj;
    }
  }