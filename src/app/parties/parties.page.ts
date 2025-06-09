import { Component, OnInit } from '@angular/core';
import { PartyService } from '../services/party.service';
import { CharacterService } from '../services/character.service';
import { Party } from '../models/party.model';
import { Observable } from 'rxjs';
import { ModalController, MenuController } from '@ionic/angular';
import { CharacterCreateComponent } from '../components/character-create.component';
import { getPartyState } from '../models/party.model';

@Component({
  selector: 'app-parties',
  templateUrl: './parties.page.html',
  styleUrls: ['./parties.page.scss'],
  standalone: false,
})
export class PartiesPage implements OnInit {
  parties$: Observable<Party[]>;
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
        backdropDismiss: false
      });
      await modal.present();
      await modal.onWillDismiss();
    }
  }
  
  /**
   * Abre el menú lateral.
   * Este método se utiliza para mostrar el menú de navegación.
   */
  openMenu() {
    this.menuCtrl.toggle();
  }
}
