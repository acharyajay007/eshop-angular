import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { ProductViewComponent } from './product';
import { ProductAddUpdateComponent } from './product';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'product/view/:id', component: ProductViewComponent },
    { path: 'product/add', component: ProductAddUpdateComponent },
    { path: 'product/edit/:id', component: ProductAddUpdateComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
