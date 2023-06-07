import { IngredientName, Condition, Recipe } from "@/app/types";
import recipes from "../../../recipes.json";
import type { NextApiRequest, NextApiResponse } from "next";

function searchRecipesByIngredients(
  ingredients: IngredientName[],
  condition: Condition
): Recipe[] {
  const results: Recipe[] = [];

  for (const recipe of recipes.recipes) {
    const recipeIngredients = recipe.ingredients.map(
      (ingredient) => ingredient.name
    );
    let ingredientMatchCount = 0;

    if (condition === Condition.OR) {
      for (const ingredient of ingredients) {
        if (recipeIngredients.includes(ingredient)) {
          ingredientMatchCount++;
          break;
        }
      }
    } else if (condition === Condition.AND) {
      for (const ingredient of ingredients) {
        if (recipeIngredients.includes(ingredient)) {
          ingredientMatchCount++;
        }
      }

      if (ingredientMatchCount !== ingredients.length) {
        continue;
      }
    }

    if (ingredientMatchCount > 0) {
      results.push(recipe as Recipe);
    }
  }

  return results;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ingredients: IngredientName[] = (
    (req.query.ingredients as string) ?? ""
  ).split(",") as IngredientName[];
  const condition: Condition =
    (req.query.condition as Condition) || Condition.OR;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Invalid or missing ingredients" });
  }

  const filteredRecipes = searchRecipesByIngredients(ingredients, condition);

  res.status(200).json({ recipes: filteredRecipes });
}
