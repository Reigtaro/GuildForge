export type PartyState = 'available' | 'protected' | 'full';

export interface ChatMessage {
    sender: string;
    text: string;
    timestamp: number;
}

export interface Party {
    id: string;
    nombre: string;
    creator: string;
    password?: string;
    members: string[];
    maxMembers: number;
    chat?: ChatMessage[];
}

/**
 * Definismo el estado de una party según sus miembros y contraseña.
 */
export function getPartyState(p: Party): PartyState {
    if (p.members.length >= p.maxMembers) return 'full';
    if (p.password) return 'protected';
    return 'available';
}