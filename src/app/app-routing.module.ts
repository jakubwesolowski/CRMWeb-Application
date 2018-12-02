import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TodosComponent} from './todos/todos.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: 'home', component: TodosComponent},
  {path: '', component: LoginComponent},
  // {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
