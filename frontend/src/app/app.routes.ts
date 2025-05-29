import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'relatorio', component: RelatorioComponent },
];