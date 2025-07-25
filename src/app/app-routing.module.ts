import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';
import { OutServeyComponent } from './out-servey/out-servey.component';
import { onboardingGuard } from './_helpers/guards/onboarding.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'error',
        loadChildren: () =>
            import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
    },
    {
        path: '',
        canActivate: [AuthGuard, onboardingGuard],
        loadChildren: () => import('./_metronic/layout/layout.module').then((m) => m.LayoutModule)

    },
    {
        path: 'onboarding',
        loadComponent: () => import('../app/_helpers/components/onboarding-wizard/onboarding-wizard.component').then(m => m.OnboardingWizardComponent),
    },
    // {
    // path:"survey",
    // component:OutServeyComponent
    // },
    // {
    //   path: 'patrol',
    //   canActivate: [AuthGuard],
    //   loadChildren: () =>
    //     import('./_angel/patrol/patrol.module').then((m) => m.PatrolModule),

    // },
    { path: '**', redirectTo: 'error/404' },

]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }