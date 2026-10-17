import { Routes } from '@angular/router';
import { AUTHENTIFICATION } from './components/authentification/authentification';
import { Acceuil } from './components/acceuil/acceuil';


import { AjouterClub } from './components/ajouter-club/ajouter-club';
import { AjouterCompte } from './components/ajouter-compte/ajouter-compte';
import { DashboardResponsable } from './components/dashboard-responsable/dashboard-responsable';
import { DashboardAdmin } from './components/dashboard-admin/dashboard-admin';
import { Championnats } from './components/championnats/championnats';
import { Joueurs } from './components/joueurs/joueurs';
import { Sanctions } from './components/sanctions/sanctions';
import { DemandeRecrutement } from './components/demande-recrutement/demande-recrutement';


export const routes: Routes = [
    {
        path:"",component:Acceuil
    },

{ path: 'admin', component: DashboardAdmin ,children:[
{
    path: 'clubs',
    component: AjouterClub
  },
  {
    path: 'responsables',
    component: AjouterCompte
  },
  {
    path: 'championnats',
    component: Championnats
  },
   {
    path: 'joueurs',
    component:Joueurs
  },
   {
    path: 'sanctions',
    component:Sanctions
  },

  
]},
{ path: 'responsable', component:DashboardResponsable,children:[
    {
    path: 'recrutement',
    component: DemandeRecrutement
  },
]}
,
 
    {
        path:"auth", title:"autentification",component:AUTHENTIFICATION
    }, {
        path:"",redirectTo:"",pathMatch:'full'
    },

];
