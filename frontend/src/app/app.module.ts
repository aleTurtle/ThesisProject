import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { AppComponent } from './app.component'; 


@NgModule({
  declarations: [
    AppComponent, // Dichiarazione dei componenti
    // altri componenti se ci sono
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // per renderlo disponibile globalmente
  ],
  providers: [],
  bootstrap: [AppComponent] // Specifica il componente di avvio
})
export class AppModule { }
