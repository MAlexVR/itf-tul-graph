export type Language = "both" | "korean" | "spanish";

export type Technique = {
  coreano: string;
  espanol: string;
  categoria: string;
  tules: Record<string, number[]>;
};

export type Movement = {
  movimiento: number;
  coreano: string;
  espanol: string;
  categoria: string;
  tecnicas?: MovementTechnique[];
};

export type MovementTechnique = Pick<Movement, "coreano" | "espanol" | "categoria">;

export type Stance = {
  inicio: string;
  final: string;
  inicio_detalle: string;
  final_detalle: string;
};

export type GraphData = {
  tules: string[];
  stances: Record<string, Stance>;
  sequences: Record<string, Movement[]>;
  movement_sequences: Record<string, Movement[]>;
  techniques: Technique[];
};
