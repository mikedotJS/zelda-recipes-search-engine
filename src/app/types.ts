export enum IngredientName {
  SPICY_PEPPER = "Spicy Pepper",
  HYRULE_BASS = "Hyrule Bass",
  RAW_MEAT = "Raw Meat",
  STAMINOKA_BASS = "Staminoka Bass",
  MIGHTY_CARP = "Mighty Carp",
  FORTIFIED_PUMPKIN = "Fortified Pumpkin",
  BLUE_NIGHTSHADE = "Blue Nightshade",
  HYRULE_HERB = "Hyrule Herb",
  SILENT_PRINCESS = "Silent Princess",
}

export enum Condition {
  OR = "OR",
  AND = "AND",
}

export interface Ingredient {
  name: IngredientName;
  quantity: number;
}

export interface Recipe {
  name: string;
  ingredients: Ingredient[];
  heartsRecovered: number;
  buff: string;
}
