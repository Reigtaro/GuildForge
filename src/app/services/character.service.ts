import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {
    private char$ = new BehaviorSubject<Character | null>(null);

    current$ = this.char$.asObservable();

    get current(): Character | null {
        return this.char$.getValue();
    }

    set(character: Character) { 
        this.char$.next(character); 
    }

    clear() {
        this.char$.next(null);
    }
}