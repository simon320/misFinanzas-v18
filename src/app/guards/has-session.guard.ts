import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PATH } from '../common/enums/enum';

export const hasSessionGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('tokenMF');

  if(!token)
    return true;

  router.navigateByUrl(PATH.DASHBOARD);
  return false;
};
