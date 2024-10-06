import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrincipalComponent } from './principal/principal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RegisterComponent } from './register/register.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './services/auth.guard';
import { noAuthGuard } from './services/no-auth.guard';
import { PasswordrecoveryComponent } from './passwordrecovery/passwordrecovery.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MisDatosComponent } from './profilecomponents/mis-datos/mis-datos.component';
import { MisBancosComponent } from './profilecomponents/mis-bancos/mis-bancos.component';
import { MiCuentaComponent } from './profilecomponents/mi-cuenta/mi-cuenta.component';
import { VehicleComponent } from './profilecomponents/vehicle/vehicle.component';
import { VehicleEditComponent } from './profilecomponents/vehicle-edit/vehicle-edit.component';
import { MisMascotasComponent } from './profilecomponents/mis-mascotas/mis-mascotas.component';
import { EditMascotaComponent } from './profilecomponents/edit-mascota/edit-mascota.component';
import { NewTripComponent } from './new-trip/new-trip.component';
import { SearchTripComponent } from './search-trip/search-trip.component';
import { ViajesBuscadosComponent } from './viajes-buscados/viajes-buscados.component';

export const routes: Routes = [{
    path: 'home',
    component: HomeComponent,
    canActivate: [noAuthGuard] 
},
{
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard] 
},
{
    path: 'profile',
    component: ProfileComponent
},
{
    path: 'notifications',
    component: NotificationsComponent
},
{
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [authGuard],
},
{
    path: 'listMenssages',
    component: ListMessagesComponent
},
{
    path: 'passRecovery',
    component: ForgotPasswordComponent
},
{
    path: 'renewPass',
    component: PasswordrecoveryComponent
},
{
    path: 'vehicle',
    component:VehicleComponent
},
{
    path: 'vehicle-edit',
    component:VehicleEditComponent
},
{
    path: 'mis-datos',
    component: MisDatosComponent,
    canActivate: [authGuard],
},
{
    path: 'mi-cuenta',
    component: MiCuentaComponent,
    canActivate: [authGuard],
},
{
    path: 'mis-bancos',
    component: MisBancosComponent,
    canActivate: [authGuard],
},
{
    path: 'mis-mascotas',
    component: MisMascotasComponent,
    canActivate: [authGuard],
},
{
    path: 'edit-mascotas',
    component: EditMascotaComponent,
    canActivate: [authGuard],
},
{
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [authGuard],
},
{
    path: 'new-trip',
    component: NewTripComponent,
    canActivate: [authGuard],
},
{
    path: 'search-trip',
    component: SearchTripComponent,
    canActivate: [authGuard],
},
{
    path: 'viajes-buscados',
    component: ViajesBuscadosComponent,
    canActivate: [authGuard],
},
{
    path: '',
    component: HomeComponent
},
{
    path: '#',
    component: HomeComponent
},


];
