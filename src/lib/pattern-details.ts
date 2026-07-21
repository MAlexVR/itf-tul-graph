export type PatternDetail = {
  kind: "Figura básica" | "Tul";
  meaning: string;
  historicalNote: string;
};

// Fuente editorial exclusiva: Manual de Teoría y Programa Técnico de Taekwon-Do ITF
// de la Asociación Colombiana de Taekwon-Do ITF, consultado en NotebookLM (2026-07-21).
export const patternDetails: Record<string, PatternDetail> = {
  "Saju Jirugi": {
    kind: "Figura básica",
    meaning: "Es el esquema básico de cruz de ataque o de puño.",
    historicalNote: "Cuenta con 14 movimientos. Fue creado para facilitar el aprendizaje de la orientación espacial y empezar a trabajar el concepto de figura.",
  },
  "Saju Makgi": {
    kind: "Figura básica",
    meaning: "Es el esquema básico de cruz de defensa.",
    historicalNote: "Cuenta con 16 movimientos. Fue creado para facilitar el aprendizaje de la orientación espacial y empezar a trabajar el concepto de figura.",
  },
  "Chon-Ji": {
    kind: "Tul",
    meaning: "Significa cielo y tierra; se interpreta en Oriente como la creación del mundo o el comienzo de la historia humana.",
    historicalNote: "Es el primer tul del practicante. Tiene 19 movimientos; la defensa lateral representa el cielo, la defensa abajo la tierra y su diagrama es una cruz (+).",
  },
  "Dan-Gun": {
    kind: "Tul",
    meaning: "Su nombre proviene del Santo Dan-Gun, fundador legendario de Corea en el año 2333 a. C.",
    historicalNote: "Tiene 21 movimientos y su diagrama representa una I mayúscula.",
  },
  "Do-San": {
    kind: "Tul",
    meaning: "Es el seudónimo del patriota Ahn Chang-Jo (1876–1938).",
    historicalNote: "Sus 24 movimientos representan toda su vida, dedicada al desarrollo de la educación en Corea y a su movimiento de independencia. Su diagrama representa una I mayúscula.",
  },
  "Won-Hyo": {
    kind: "Tul",
    meaning: "El nombre de la figura se debe al monje que introdujo el budismo a Corea durante la dinastía Silla, en el año 686 d. C.",
    historicalNote: "Tiene 28 movimientos y su diagrama representa una I mayúscula.",
  },
  "Yul-Gok": {
    kind: "Tul",
    meaning: "Es el seudónimo del gran filósofo y erudito Yi I (Yi Primero), llamado el Confucio de Corea.",
    historicalNote: "Tiene 38 movimientos, referidos a su lugar de nacimiento sobre el paralelo 38; el diagrama significa erudito. Introduce el salto rasante para caer en Kiocha Sogi.",
  },
  "Joong-Gun": {
    kind: "Tul",
    meaning: "Proviene del nombre del patriota Ann Joon-Gun, quien dio muerte a Hiro-Bumi Ito, primer gobernador japonés de Corea.",
    historicalNote: "Tiene 32 movimientos, que representan la edad en la que Ann Joon-Gun fue ejecutado en la cárcel de Lui-Shung (1910). Su diagrama representa una I mayúscula.",
  },
  "Toi-Gye": {
    kind: "Tul",
    meaning: "Es el nombre del célebre erudito Yi Hwang (siglo XVI), autoridad en el tema del confucionismo.",
    historicalNote: "Tiene 37 movimientos, que representan su lugar de nacimiento sobre el paralelo 37; el diagrama representa erudito. Incluye el movimiento estampado (pisón).",
  },
  "Hwa-Rang": {
    kind: "Tul",
    meaning: "Su nombre se debe al grupo de jóvenes de la dinastía Silla, los Hwa-Rang-Do, de comienzos del siglo VII.",
    historicalNote: "Tiene 29 movimientos, referidos a la 29.ª División de Infantería donde el Taekwon-Do se desarrolló y maduró. Su diagrama representa una I mayúscula.",
  },
  "Choong-Moo": {
    kind: "Tul",
    meaning: "Nombre del gran almirante Yi Soon-Sin de la dinastía Lee.",
    historicalNote: "Tiene 30 movimientos. Inventó el primer barco de guerra armado en 1592, precursor de los submarinos modernos. Termina con ataque de puño izquierdo, que simboliza su muerte.",
  },
};
