import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const blogId = environment.blogApi.blogId;

  if (blogId) {
    const modifiedReq = req.clone({
      headers: req.headers.set('X-Blog-ID', blogId)
    });
    return next(modifiedReq);
  }

  return next(req);
};