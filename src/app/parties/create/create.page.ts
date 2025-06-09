import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PartyService } from '../../services/party.service';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit {

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    password: [''],
    maxMembers: [6, [Validators.required, Validators.min(2), Validators.max(12)]]
  });

  ngOnInit(): void {
  }

  constructor(
    private fb: FormBuilder,
    private partySvc: PartyService,
    private charSvc: CharacterService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  /**
   * Creamos una nueva party.
   * Primero validamos el formulario, si no es válido mostramos un mensaje de error.
   * Luego verificamos si hay un personaje activo.
   * Si no hay personaje, mostramos un mensaje de error.
   * @returns 
   */
  async crear() {
    if (this.form.invalid) {
      const a = await this.alertCtrl.create({
        header: 'Error',
        message: 'Completa todos los campos requeridos.',
        buttons: ['OK']
      });
      await a.present();
      return;
    }
    const chr = this.charSvc.current;
    if (!chr) {
      await this.alertCtrl
        .create({ header: 'Error', message: 'No se ha creado tu personaje.', buttons: ['OK'] })
        .then(a => a.present());
      return;
    }

    const nombre = this.form.get('nombre')!.value!;
    const password = this.form.get('password')!.value || undefined;
    const maxMembers = this.form.get('maxMembers')!.value!;

    const id = this.partySvc.create(nombre, chr.nick, password, maxMembers);
    this.router.navigate(['/parties', id]);
  }
}
