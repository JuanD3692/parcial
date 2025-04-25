import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {

    const router: Router = inject(Router);

    const token = localStorage.getItem('token');

    if (token) {
        return true;
    }

    return router.navigate(["login"]);
    
    
};
