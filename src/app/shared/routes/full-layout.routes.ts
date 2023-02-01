import { Routes, RouterModule } from '@angular/router';

export const FullLayout_ROUTES: Routes = [

    {
      path:'user',
      loadChildren:()=>import('../../test-form/test-form.module').then(m=>m.TestFormModule)
    }

];
