import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartyService } from '../../services/party.service';
import { Party, getPartyState } from '../../models/party.model';
import { CharacterService } from '../../services/character.service';
import { ChatModalComponent } from '../../components/chat-modal.component';
import { ModalController, AlertController }    from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  party!: Party;
  state!: 'available' | 'protected' | 'full';

  constructor(
    private route: ActivatedRoute,
    private partySvc: PartyService,
    private charSvc: CharacterService,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  get isMember(): boolean {
    const nick = this.charSvc.current?.nick;
    return nick ? this.party.members.includes(nick) : false;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/parties']);
      return;
    }
    const p = this.partySvc.getById(id);
    if (!p) {
      this.router.navigate(['/parties']);
      return;
    }
    this.party = p;
    this.state = getPartyState(p);
  }

  /**
   * Este método se encarga de actualizar la información de la party.
   * Se llama cada vez que se une o sale un miembro.
   * Si la party ya no existe, redirige a la lista de parties.
   */
  private refreshParty(): void {
    const updated = this.partySvc.getById(this.party.id);
    if (!updated) {
      this.router.navigate(['/parties']);
      return;
    }
    this.party = updated;
    this.state = getPartyState(this.party);
  }

  /**
   * Este método se encarga de unirse a una party.
   * Primero verifica si el usuario ya es miembro.
   * Si es miembro, no hace nada.
   * Si la party es protegida, solicita una contraseña.
   * Si la contraseña es correcta, se une a la party.
   * @returns 
   */
  async join() {
    const nick = this.charSvc.current!.nick;

    if (this.isMember) {
      return;
    }

    if (this.state === 'protected') {
      const alert = await this.alertCtrl.create({
        header: 'Contraseña requerida',
        inputs: [{ name: 'pw', type: 'password', placeholder: 'Contraseña' }],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Unirse',
            handler: res => {
              if (res.pw === this.party.password) {
                this.partySvc.join(this.party.id, nick);
                this.refreshParty();
                return true;
              } else {
                alert.message = 'Contraseña incorrecta';
                return false;
              }
            }
          }
        ]
      });
      await alert.present();
    }
    else if (this.state === 'available') {
      this.partySvc.join(this.party.id, nick);
      this.refreshParty();
    }
  }

  leave() {
    this.partySvc.leave(this.party.id, this.charSvc.current!.nick);
    this.refreshParty();
  }

  /** abirmos el modal de chat de la party */
  async openChat() {
    if (this.isMember) {
      return this.presentChat();
    }

    if (this.state === 'protected') {
      const alert = await this.alertCtrl.create({
        header: 'Contraseña requerida',
        inputs: [
          { name: 'pw', type: 'password', placeholder: 'Contraseña' }
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Abrir chat',
            handler: res => {
              if (res.pw === this.party.password) {
                this.presentChat();
                return true;
              } else {
                alert.message = 'Contraseña incorrecta';
                return false;
              }
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    return this.presentChat();
  }

  /** Crea y muestra el modal de chat */
  private async presentChat() {
    const m = await this.modalCtrl.create({
      component: ChatModalComponent,
      componentProps: {
        partyId:   this.party.id,
        partyName: this.party.nombre
      }
    });
    await m.present();
  }
}