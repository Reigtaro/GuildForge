import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CharacterService } from '../services/character.service';
import { Character, Clase, Stats } from '../models/character.model';

@Component({
    selector: 'app-character-create',
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule],
    template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Crea a tú Personaje</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="crear()">
        <ion-item lines="full">
          <ion-label position="floating">Nick</ion-label>
          <ion-input formControlName="nick"></ion-input>
        </ion-item>
        <ion-note slot="error"
          *ngIf="form.controls['nick'].invalid && form.controls['nick'].touched">
          Debe tener entre 3 y 16 caracteres.
        </ion-note>

        <ion-item lines="full">
          <ion-label>Clase</ion-label>
          <ion-select formControlName="clase" placeholder="Selecciona clase">
            <ion-select-option *ngFor="let c of clases" [value]="c">{{ c }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-note slot="error"
          *ngIf="form.controls['clase'].invalid && form.controls['clase'].touched">
          Selecciona una clase.
        </ion-note>

        <div *ngIf="form.valid" class="stats-preview">
            <h3>Estadísticas:</h3>
            <p class="stat hp">HP: {{ stats.hp }}</p>
            <p class="stat mp">MP: {{ stats.mp }}</p>
            <p class="stat atk">ATK: {{ stats.atk }}</p>
            <p class="stat def">DEF: {{ stats.def }}</p>
            <p class="stat spd">SPD: {{ stats.spd }}</p>
        </div>

        <ion-button
          expand="block"
          type="submit"
          [disabled]="form.invalid"
          class="create-btn"
        >
          Crear
        </ion-button>
      </form>
    </ion-content>
  `,
    styles: [`
    /* Fondo del modal */
    :host ::ng-deep ion-content {
        --background: var(--app-bg);
    }

    /* Toolbar del header */
    :host ::ng-deep ion-header ion-toolbar {
        --background: var(--ion-color-primary);
    }
    :host ::ng-deep ion-header ion-title {
        color: var(--ion-color-primary-contrast);
    }

    /* Cada ítem (label + input/select) */
    :host ::ng-deep ion-item {
        --background: var(--card-bg);
        --border-radius: 8px;
        margin: 8px 0;
    }
    /* Color de texto de label */
    :host ::ng-deep ion-label {
        color: var(--text-main);
    }
    /* Color de placeholder y texto del input/select */
    :host ::ng-deep ion-input,
    :host ::ng-deep ion-select {
        --color: var(--text-main);
        --placeholder-color: var(--text-sub);
    }

    /* Stat-preview más llamativo */
    .stats-preview {
        margin: 16px 0;
        background: var(--card-bg);
        padding: 12px;
        border-radius: 8px;
    }
    .stats-preview h3 {
        margin: 0 0 8px;
        font-size: 1.1rem;
        color: var(--text-main);
    }
    .stats-preview p {
        margin: 4px 0;
        color: var(--text-sub);
    }

    /* Botón Crear */
    .create-btn {
        margin-top: 24px;
        --background: var(--ion-color-primary);
        --color: var(--ion-color-primary-contrast);
    }

    /* Notas de error */
    ion-note[slot="error"] {
        color: var(--ion-color-danger);
        margin-left: 16px;
        font-size: 0.85rem;
    }

    .stats-preview p {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }

    /* Reglas comunes */
    .stat {
        font-weight: 600;      /* un poco más grueso */
    }

    /* Colores típicos */
    .hp { color: var(--ion-color-success); }
    .mp { color: var(--ion-color-primary); }
    .atk { color: var(--ion-color-danger); }
    .def { color: var(--ion-color-warning); }
    .spd { color: var(--accent); }
  `]
})
export class CharacterCreateComponent {
    form = this.fb.group({
        nick: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
        clase: [null as Clase | null, Validators.required],
    });

    clases: Clase[] = [
        'Arquero', 'Daguero', 'Paladín', 'Curandero',
        'Chamán', 'Mago elemental', 'Guerrero',
        'Bárbaro', 'Enano', 'Bardo'
    ];

    private statsMap: Record<Clase, Stats> = {
        'Arquero': { hp: 80, mp: 30, atk: 15, def: 10, spd: 20 },
        'Daguero': { hp: 70, mp: 20, atk: 18, def: 8, spd: 25 },
        'Paladín': { hp: 120, mp: 40, atk: 12, def: 18, spd: 10 },
        'Curandero': { hp: 60, mp: 100, atk: 8, def: 8, spd: 12 },
        'Chamán': { hp: 65, mp: 90, atk: 10, def: 9, spd: 14 },
        'Mago elemental': { hp: 50, mp: 120, atk: 20, def: 5, spd: 10 },
        'Guerrero': { hp: 140, mp: 20, atk: 18, def: 15, spd: 8 },
        'Bárbaro': { hp: 150, mp: 10, atk: 20, def: 12, spd: 6 },
        'Enano': { hp: 130, mp: 30, atk: 14, def: 20, spd: 8 },
        'Bardo': { hp: 75, mp: 60, atk: 10, def: 10, spd: 18 },
    };

    stats: Stats = { hp: 0, mp: 0, atk: 0, def: 0, spd: 0 };

    constructor(
        private fb: FormBuilder,
        private modalCtrl: ModalController,
        private charSvc: CharacterService
    ) {
        /**
         * Suscribimos a los cambios del campo 'clase' para actualizar las estadísticas
         * cuando el usuario seleccione una clase.
         */
        this.form.get('clase')!.valueChanges
            .subscribe(value => {
                if (value && this.statsMap[value as Clase]) {
                    this.stats = this.statsMap[value as Clase];
                }
            });
    }

    /**
     * Crea un nuevo personaje con los datos del formulario.
     * Si el formulario es válido, construye un objeto Character y lo guarda
     * usando el CharacterService.
     * Luego cierra el modal.
     */
    async crear() {
        if (this.form.valid) {
            // Extraemos raw y garantizamos no-null antes de construir
            const raw = this.form.value;
            const nick = raw.nick as string;
            const clase = raw.clase as Clase;

            const character: Character = {
                id: crypto.randomUUID(),
                nick,
                clase,
                stats: this.statsMap[clase],
            };
            this.charSvc.set(character);
            await this.modalCtrl.dismiss();
        }
    }
}