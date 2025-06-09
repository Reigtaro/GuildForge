import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { CharacterService } from '../services/character.service';
import { PartyService } from '../services/party.service';
import { Party } from '../models/party.model';
import { CharacterCreateComponent } from '../components/character-create.component';
import { Observable, tap } from 'rxjs';
import { getPartyState } from '../models/party.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  parties$: Observable<Party[]>;
  searchId = '';
  getState = getPartyState;

  constructor(
    public charSvc: CharacterService,
    private partySvc: PartyService,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController
  ) {
    this.parties$ = this.partySvc.list$;
  }

  async ngOnInit() {
    if (!this.charSvc.current) {
      const modal = await this.modalCtrl.create({
        component: CharacterCreateComponent,
        backdropDismiss: false,
      });
      await modal.present();
      await modal.onWillDismiss();
    }
  }

  /**
   * Busca un personaje por su ID.
   * Si se proporciona un ID, filtra la lista de personajes
   * para mostrar solo el personaje correspondiente.
   * Si no se proporciona un ID, muestra todos los personajes.
   * @param evt 
   */
  onSearchChange(evt: any) {
    this.searchId = evt.detail.value;
    if (this.searchId) {
      this.parties$ = this.partySvc.list$.pipe(
        tap(list => {
          const match = list.find(p => p.id === this.searchId);
          this.parties$ = new Observable(sub => {
            if (match) sub.next([match]);
            else sub.next([]);
            sub.complete();
          });
        })
      );
    } else {
      this.parties$ = this.partySvc.list$;
    }
  }

  /**
   * Abre el menú lateral de la aplicación.
   * Utiliza el MenuController de Ionic para alternar el menú.
   * Esto permite al usuario acceder a opciones adicionales como
   * configuración, perfil, etc.
   */
  openMenu() {
    this.menuCtrl.toggle();
  }
}
