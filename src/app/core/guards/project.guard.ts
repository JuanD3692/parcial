import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const projectGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // Check if we're in a browser environment
    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('token');

        if (!token) {
            return true;
        }
        
        return router.navigate(["layout"]);
    }

    // If not in browser, default to allowing navigation
    return true;
};