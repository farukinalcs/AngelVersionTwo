import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const onboardingGuard: CanActivateFn = (route, state) => {
    const onboarded = localStorage.getItem('onboarded');

    if (onboarded === 'true') {
        return true;
    }

    // Router'a erişmek için inject kullanılır (Angular 14+)
    const router = inject(Router);
    router.navigate(['/onboarding']);
    return false;
};
