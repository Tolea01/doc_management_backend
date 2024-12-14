import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
@Injectable()
export class ExcludeUserPasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.processData(data)));
  }

  private processData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removePasswordField(item));
    } else if (typeof data === 'object' && data !== null) {
      return this.removePasswordField(data);
    }
    return data;
  }

  private removePasswordField(object: any): any {
    if (typeof object === 'object' && object !== null) {
      for (const key in object) {
        if (key === 'password') {
          delete object[key];
        } else if (typeof object[key] === 'object') {
          this.removePasswordField(object[key]);
        }
      }
    }
    return object;
  }
}
