import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full-layout/full-layout.component";
import { CommonLayoutComponent } from "./layouts/common-layout/common-layout.component";

import { FullLayout_ROUTES } from "./shared/routes/full-layout.routes";
import { CommonLayout_ROUTES } from "./shared/routes/common-layout.routes";
import { use } from 'echarts';

const appRoutes: Routes = [

     { path: '', redirectTo: '/mintur/formulario', pathMatch: 'full' },
    {
        path: 'mintur',
        component: FullLayoutComponent,
        children: FullLayout_ROUTES
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            useHash : true
        })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {
}
