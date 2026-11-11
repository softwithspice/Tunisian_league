import { Routes } from '@angular/router';
import { AUTHENTIFICATION } from './components/authentification/authentification';
import { Acceuil } from './components/acceuil/acceuil';


import { ClubJoueurs } from './components/club-joueurs/club-joueurs';
import { Calendrier } from './components/calendrier/calendrier';
export const routes: Routes = [
    { path: 'calendrier', component: Calendrier },
    {
        path:"",component:Acceuil
    },

    {
        path: 'clubs/:clubId/joueurs', title: 'Joueurs du club', component: ClubJoueurs
    },

{ path: 'admin', loadComponent: () => import('./components/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin) ,children:[
{ path: 'journees', loadComponent: () => import('./components/journee/journee').then(m => m.Journee) },
{
    path: 'clubs',
    loadComponent: () => import('./components/ajouter-club/ajouter-club').then(m => m.AjouterClub)
  },
  {
    path: 'responsables',
    loadComponent: () => import('./components/ajouter-compte/ajouter-compte').then(m => m.AjouterCompte)
  },
  {
    path: 'championnats',
    loadComponent: () => import('./components/championnats/championnats').then(m => m.Championnats)
  },
   {
    path: 'joueurs',
    loadComponent: () => import('./components/joueurs/joueurs').then(m => m.Joueurs)
  },
   {
    path: 'sanctions',
    loadComponent: () => import('./components/sanctions/sanctions').then(m => m.Sanctions)
  },
  {
    path:'Gerer_demandes',
    loadComponent: () => import('./components/gerer-demandes/gerer-demandes').then(m => m.GererDemandes)
  }

  
]},
{ path: 'responsable', loadComponent: () => import('./components/dashboard-responsable/dashboard-responsable').then(m => m.DashboardResponsable),children:[
    {
    path: 'recrutement',
    loadComponent: () => import('./components/demande-recrutement/demande-recrutement').then(m => m.DemandeRecrutement)
  },
  {

  path: 'mon-effectif',
  loadComponent: () => import('./components/afficher-joueurs/afficher-joueurs').then(m => m.AfficherJoueurs)
},
]},

{
  path: 'changer-mot-de-passe',
  loadComponent: () => import('./components/changer-mot-de-passe/changer-mot-de-passe').then(m => m.ChangerMotDePasse)
},
{
    path: 'sanctions',
    loadComponent: () => import('./components/mes-sanctions/mes-sanctions').then(m => m.MesSanctions)
  }
,
 
    {
        path:"auth", title:"autentification",component:AUTHENTIFICATION
    }, {
        path:"",redirectTo:"",pathMatch:'full'
    },

];
