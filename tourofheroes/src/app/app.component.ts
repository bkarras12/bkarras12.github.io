import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { CommonModule } from '@angular/common';
import { HeroService } from './hero.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './app-routing.module';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeroesComponent, MessagesComponent,AppRoutingModule],
  templateUrl: './app.component.html',
  styleUrls:['./app.component.css'],
  providers: [
    HeroService,
    MessageService
 ],

})
export class AppComponent {
  title = 'Tour of Heroes';
}


