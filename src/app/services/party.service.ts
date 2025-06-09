import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Party, getPartyState, PartyState } from '../models/party.model';
import { ChatMessage } from '../models/party.model';

/**
 * Genera un código de party aleatorio de 8 caracteres alfanuméricos.
 * Se usa para identificar parties en la app.
 */
function generatePartyCode(len = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < len; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

@Injectable({ providedIn: 'root' })
export class PartyService {
    private parties$ = new BehaviorSubject<Party[]>(this._initialParties());

    get list$(): Observable<Party[]> {
        return this.parties$.asObservable();
    }

    byState$(state: PartyState): Observable<Party[]> {
        return this.parties$.pipe(
            map(list => list.filter(p => getPartyState(p) === state))
        );
    }

    /** Crea una party nueva y la añade al listado */
    create(nombre: string, creator: string, password?: string, maxMembers = 6) {
        const newParty: Party = {
            id: generatePartyCode(8),
            nombre,
            creator,
            password: password?.trim() || undefined,
            members: [creator],
            maxMembers,
        };
        this.parties$.next([newParty, ...this.parties$.value]);
        return newParty.id;
    }

    /** Añade un miembro si no está llena */
    join(partyId: string, nick: string): boolean {
        const list = this.parties$.value.map(p => {
            if (p.id === partyId && p.members.length < p.maxMembers) {
                return { ...p, members: [...p.members, nick] };
            }
            return p;
        });
        this.parties$.next(list);
        return true;
    }

    /** Quita un miembro */
    leave(partyId: string, nick: string) {
        const list = this.parties$.value.map(p => {
            if (p.id === partyId) {
                return { ...p, members: p.members.filter(m => m !== nick) };
            }
            return p;
        });
        this.parties$.next(list);
    }

    /** Busca una party por ID */
    getById(id: string): Party | undefined {
        return this.parties$.value.find(p => p.id === id);
    }

    /** Partys de ejemplo iniciales */
    private _initialParties(): Party[] {
        return [
            {
                id: generatePartyCode(8),
                nombre: 'Matrix',
                creator: 'benxh',
                password: undefined,
                members: ['benxh', 'Reigtaro', 'ro-mina'],
                maxMembers: 6,
                chat: [
                    { sender: 'benxh', text: 'Buena cabros como estan?', timestamp: Date.now() },
                    { sender: 'Reigtaro', text: 'Bien y tu bro? Como estas?', timestamp: Date.now() },
                    { sender: 'benxh', text: 'Bien, aca probando el chat', timestamp: Date.now() },
                    { sender: 'ro-mina', text: 'Hola a todos!', timestamp: Date.now() }
                ]
            },
            {
                id: generatePartyCode(8),
                nombre: 'Guardianes',
                creator: 'Gandalf',
                password: 'mellon',
                members: ['Gandalf', 'Frodo'],
                maxMembers: 6,
                chat: [
                    { sender: 'Gandalf', text: 'Escuchad mi consejo…', timestamp: Date.now() }
                ]
            },
            {
                id: generatePartyCode(8),
                nombre: 'Sombras',
                creator: 'Nazgul',
                password: 'sauron',
                members: ['Nazgul', 'BlackRider', 'WitchKing', 'Mouth', 'Khamul', 'JalNazgul'],
                maxMembers: 6,
                chat: [
                    { sender: 'Nazgul', text: 'La oscuridad se acerca...', timestamp: Date.now() },
                    { sender: 'BlackRider', text: 'Estamos listos para servir al Señor Oscuro.', timestamp: Date.now() },
                    { sender: 'WitchKing', text: 'Ningún hombre puede detenernos.', timestamp: Date.now() },
                    { sender: 'Mouth', text: 'La voluntad de Sauron prevalecerá.', timestamp: Date.now() },
                    { sender: 'Khamul', text: 'Los caballos alados están listos.', timestamp: Date.now() },
                    { sender: 'JalNazgul', text: 'La tierra temblará ante nuestro paso.', timestamp: Date.now() }
                ]
            }
        ];
    }

    /** obtenemos el chat actual de una party */
    getChat(partyId: string): ChatMessage[] {
        return this.getById(partyId)?.chat ?? [];
    }

    /** añadimos un mensaje al chat de la party */
    addChatMessage(partyId: string, msg: ChatMessage) {
        const updated = this.parties$.value.map(p => {
            if (p.id === partyId) {
                const chat = p.chat ? [...p.chat, msg] : [msg];
                return { ...p, chat };
            }
            return p;
        });
        this.parties$.next(updated);
    }
}
