import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PATH } from '../common/enums/enum';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('tokenMF');

  if(token)
    return true;

  router.navigateByUrl(PATH.LOGIN);
  return false;
};
