import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private charSvc: CharacterService
  ) {
    this.loginForm = this.fb.group({
      nick: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(16),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.loginForm.valid) {
      const { nick } = this.loginForm.value;
      // Solo pasamos el nick, no creamos aún el personaje hasta que lleguemos al home
      this.router.navigate(['/home'], { state: { nick } });
    }
  }

}
