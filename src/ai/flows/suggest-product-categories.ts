'use server';

/**
 * @fileOverview An AI agent that suggests product categories based on current trends and sales data.
 *
 * - suggestProductCategories - A function that handles the product category suggestion process.
 * - SuggestProductCategoriesInput - The input type for the suggestProductCategories function.
 * - SuggestProductCategoriesOutput - The return type for the suggestProductCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductCategoriesInputSchema = z.object({
  productName: z.string().describe('The name of the product to categorize.'),
  productDescription: z.string().describe('A description of the product.'),
  recentSalesData: z.string().describe('Recent sales data, including product names and quantities sold.'),
  trendingProducts: z.string().describe('A list of trending products and categories.'),
});
export type SuggestProductCategoriesInput = z.infer<typeof SuggestProductCategoriesInputSchema>;

const SuggestProductCategoriesOutputSchema = z.object({
  suggestedCategories: z.array(z.string()).describe('An array of suggested product categories.'),
  reasoning: z.string().describe('The reasoning behind the suggested categories.'),
});
export type SuggestProductCategoriesOutput = z.infer<typeof SuggestProductCategoriesOutputSchema>;

export async function suggestProductCategories(input: SuggestProductCategoriesInput): Promise<SuggestProductCategoriesOutput> {
  return suggestProductCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductCategoriesPrompt',
  input: {schema: SuggestProductCategoriesInputSchema},
  output: {schema: SuggestProductCategoriesOutputSchema},
  prompt: `You are an AI assistant helping shop owners categorize their products.

  Based on the product name, description, recent sales data, and trending products, suggest relevant product categories.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Recent Sales Data: {{{recentSalesData}}}
  Trending Products: {{{trendingProducts}}}

  Suggest a few relevant categories for the product and explain your reasoning.
  Ensure that the suggested categories are in the format of an array of strings.
  Output should follow this format:
  {
    "suggestedCategories": ["category1", "category2", "category3"],
    "reasoning": "Explanation of why these categories are suggested."
  }`,
});

const suggestProductCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestProductCategoriesFlow',
    inputSchema: SuggestProductCategoriesInputSchema,
    outputSchema: SuggestProductCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
