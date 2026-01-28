import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { MessageService } from './message.service';







@Injectable({
  providedIn: 'root'
})
export class HeroService {

  
  constructor(private messageService: MessageService) { }



  getHeroes(): Observable<Hero[]> {
   // Todo: send the message _after_ fetching the heroes
   this.messageService.add('HeroService: fetched heroes');
   return of(HEROES);
 }

 getHero(id: number): Observable<Hero> {
   //For now, assume that a hero with the specified `id` always exists.
   // Error handling will be added in the next step of the tutorial.
   const hero = HEROES.find(h => h.id === id)!;
   this.messageService.add(`HeroService: fetched hero id=${id}`);
   return of(hero);
 }





}
