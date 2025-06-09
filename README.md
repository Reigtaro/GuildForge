# GuildForge

**GuildForge** es una aplicación híbrida (Ionic + Angular) para gestionar guilds y parties en juegos RPG. Permite a los usuarios crear su personaje, unirse o crear parties, chatear con los miembros y programar eventos de guild.

---

## 📌 Características principales

- **Autenticación simple**  
  – Login con nickname + contraseña (local, sin base de datos).  
  – Redirección automática al flujo de creación de personaje si aún no existe.

- **Creación de personaje**  
  – Formulario reactivo: Nick (pre-llenado tras login) + selección de **clase**.  
  – Clases incluidas: Arquero, Daguero, Paladín, Curandero, Chamán, Mago elemental, Guerrero, Bárbaro, Enano, Bardo.  
  – Estadísticas automáticas según clase (HP, MP, ATK, DEF, SPD).

- **Listado y búsqueda de Parties**  
  – Página “Home” con buscador por código de party (ID de 8 caracteres).  
  – Cards coloreadas según estado:  
    - 🟢 Disponible  
    - 🔒 Protegida (requiere password)  
    - 🚫 Llena  
  – Vista de perfil de usuario con sus stats.

- **Creación y detalle de Party**  
  – Formulario para crear party: nombre, password opcional, máximo 6 miembros.  
  – Página de detalle:  
    - Unirse / Salir (botones inteligentes según membership & estado)  
    - Chat en modal, con historial y mensajes por defecto  
    - Lista de miembros actualizable en tiempo real

- **Chat integrado**  
  – Modal de chat por party  
  – Mensajes con remitente y timestamp  
  – Guardado en memoria dentro de cada party

- **Programación de eventos (próximamente)**  
  – Página de Eventos con lista y modal para crear nuevas reuniones o raids

---

## 🚀 Tecnologías

- **Framework**: [Ionic Framework](https://ionicframework.com/)  
- **Lenguaje**: TypeScript / Angular  
- **Estilos**: SCSS con variables temáticas  
- **Estado**: RxJS y BehaviorSubject para parties & character  
- **Formularios**: Angular Reactive Forms  
- **Routing**: Angular Router + IonMenu (menú de hamburguesa)

---