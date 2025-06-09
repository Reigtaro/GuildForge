import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { PartyService } from '../services/party.service';
import { CharacterService } from '../services/character.service';
import { ChatMessage } from '../models/party.model';

@Component({
    selector: 'app-chat-modal',
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
    template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Chat: {{ partyName }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">✕</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let msg of chat">
          <strong>{{ msg.sender }}:</strong>
          <span class="text">{{ msg.text }}</span>
          <ion-note slot="end" class="time">
            {{ msg.timestamp | date:'shortTime' }}
          </ion-note>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-item>
          <ion-input
            placeholder="Escribe aquí..."
            [formControl]="inputCtrl"
            (keydown.enter)="send()"
          ></ion-input>
          <ion-button slot="end" (click)="send()">Enviar</ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  `,
    styles: [`
    ion-item { 
      --padding-start: 8px; 
    }
    .text { margin-left: 4px; }
    .time { font-size: 0.7rem; opacity: 0.6; }
  `]
})
export class ChatModalComponent implements OnInit {
    @Input() partyId!: string;
    @Input() partyName!: string;

    chat: ChatMessage[] = [];
    inputCtrl = new FormControl('');

    constructor(
        private partySvc: PartyService,
        private charSvc: CharacterService,
        private modalCtrl: ModalController
    ) { }

    ngOnInit() {
        this.chat = this.partySvc.getChat(this.partyId);
    }

    /**
     * Envía un mensaje al chat de la party.
     * Si el input está vacío, no hace nada.
     * Limpia el input después de enviar.
     */
    send() {
        const text = this.inputCtrl.value?.trim();
        if (!text) return;
        const msg: ChatMessage = {
            sender: this.charSvc.current!.nick,
            text,
            timestamp: Date.now()
        };
        this.partySvc.addChatMessage(this.partyId, msg);
        this.chat = this.partySvc.getChat(this.partyId);
        this.inputCtrl.reset();
    }

    /**
     * Cierra el modal del chat.
     */
    close() {
        this.modalCtrl.dismiss();
    }
}