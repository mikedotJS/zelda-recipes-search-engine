"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Select,
  List,
  ListItem,
  ChakraProvider,
} from "@chakra-ui/react";
import { Condition, Recipe } from "./types";
import { ingredientOptions } from "./ingredientOptions";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [condition, setCondition] = useState<Condition>(Condition.OR);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedIngredients, setSuggestedIngredients] = useState<string[]>(
    []
  );

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value) {
      setIngredients((prevIngredients) => [...prevIngredients, value]);
    }
  };

  const handleIngredientKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value) {
        setIngredients((prevIngredients) => [...prevIngredients, value]);
      }
    }
  };

  const handleIngredientRemove = (index: number) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((_, i) => i !== index)
    );
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Condition;
    setCondition(value);
  };

  const handleSearch = () => {
    setIsLoading(true);
    fetch(
      `/api/recipes?ingredients=${ingredients.join(",")}&condition=${condition}`
    )
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.recipes);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setIsLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value) {
      const suggested = ingredientOptions.filter((option) =>
        option.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestedIngredients(suggested);
    } else {
      setSuggestedIngredients([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIngredients((prevIngredients) => [...prevIngredients, suggestion]);
    setSuggestedIngredients([]);
  };

  return (
    <ChakraProvider>
      <Box p={4} maxWidth="400px" mx="auto">
        <Stack spacing={4}>
          <FormControl id="ingredients">
            <FormLabel>Ingredients</FormLabel>
            <Input
              type="text"
              placeholder="Enter ingredient..."
              onChange={handleInputChange}
              onKeyDown={handleIngredientKeyDown}
              autoFocus
            />
            {suggestedIngredients.length > 0 && (
              <List mt={2}>
                {suggestedIngredients.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    cursor="pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </ListItem>
                ))}
              </List>
            )}
          </FormControl>

          <Box>
            {ingredients.map((ingredient, index) => (
              <Box
                key={index}
                display="inline-flex"
                alignItems="center"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
                px={2}
                py={1}
                mr={2}
                mt={2}
                lineHeight="1"
              >
                <Text>{ingredient}</Text>
                <Button
                  variant="ghost"
                  size="sm"
                  ml={2}
                  onClick={() => handleIngredientRemove(index)}
                >
                  X
                </Button>
              </Box>
            ))}
          </Box>

          <FormControl id="condition">
            <FormLabel>Condition</FormLabel>
            <Select value={condition} onChange={handleConditionChange}>
              <option value={Condition.OR}>OR</option>
              <option value={Condition.AND}>AND</option>
            </Select>
          </FormControl>

          <Button
            colorScheme="teal"
            onClick={handleSearch}
            isLoading={isLoading}
          >
            Search
          </Button>

          {recipes.length > 0 && (
            <Box mt={4}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Search Results
              </Text>
              <Stack spacing={4}>
                {recipes.map((result, index) => (
                  <Box
                    key={index}
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    my={2}
                  >
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      {result.name}
                    </Text>
                    <Text>
                      👩‍🍳{" "}
                      {result.ingredients.map((ingredient, i) => (
                        <span key={i}>
                          {i > 0 && ", "}
                          {ingredient.quantity}{" "}
                          <strong>{ingredient.name}</strong>
                        </span>
                      ))}
                    </Text>
                    <Text>❤️ {result.heartsRecovered}</Text>
                    <Text>✳️ {result.buff}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </ChakraProvider>
  );
}
