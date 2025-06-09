import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GuildEvent } from '../models/guild-event.model';

@Injectable({providedIn:'root'})
export class EventService {
  private evts$ = new BehaviorSubject<GuildEvent[]>([]);
  list$ = this.evts$.asObservable();
  add(e: GuildEvent) { this.evts$.next([e, ...this.evts$.value]); }
}