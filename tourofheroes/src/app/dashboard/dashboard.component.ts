import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { RouterModule } from '@angular/router';

@Component({
 selector: 'app-dashboard',
 standalone: true,
 imports: [CommonModule, RouterModule],
 templateUrl: './dashboard.component.html',
 styleUrls: [ './dashboard.component.css' ]
})

export class DashboardComponent implements OnInit {
 heroes: Hero[] = [];

 constructor(private heroService: HeroService) { }

 ngOnInit() {
   this.getHeroes();
 }

 getHeroes(): void {
   this.heroService.getHeroes()
     .subscribe(heroes => this.heroes = heroes.slice(1, 5));
 }
}
