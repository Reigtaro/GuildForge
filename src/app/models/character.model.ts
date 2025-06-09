/**
 * Las clases disponibles en GuildForge
 */
export type Clase =
  | 'Arquero'
  | 'Daguero'
  | 'Paladín'
  | 'Curandero'
  | 'Chamán'
  | 'Mago elemental'
  | 'Guerrero'
  | 'Bárbaro'
  | 'Enano'
  | 'Bardo';

/**
 * Estructura de estadísticas básicas
 */
export interface Stats {
  hp: number; // Puntos de vida
  mp: number; // Puntos de maná
  atk: number; // Ataque
  def: number; // Defensa
  spd: number; // Velocidad
}

/**
 * Modelo de un personaje
 */
export interface Character {
  id: string; // UUID
  nick: string; // Nombre de usuario
  clase: Clase; // Una de las Clases de arriba
  stats: Stats; // Estadísticas según la clase
}