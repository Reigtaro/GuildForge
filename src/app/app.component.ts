import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterService } from './services/character.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private router: Router,
    private charSvc: CharacterService
  ) {}

  logout() {
    // Redirigir a login
    this.router.navigate(['/login']);
  }
}
