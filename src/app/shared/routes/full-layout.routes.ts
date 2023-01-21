import { Routes, RouterModule } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'authentication',
        loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
      path:'user',
      loadChildren:()=>import('../../test-form/test-form.module').then(m=>m.TestFormModule)
    }
];
