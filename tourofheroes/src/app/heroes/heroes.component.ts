import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { CommonModule, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/Forms';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-heroes',
  imports: [CommonModule, FormsModule, NgFor, NgIf, UpperCasePipe, HeroDetailComponent, RouterModule],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
  standalone: true
})
export class HeroesComponent implements OnInit{

  heroes: Hero[] = [];
  selectedHero?: Hero;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
   this.getHeroes();
 }


 

  getHeroes(): void {
  this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
}


  
}
