"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Loader2, Wand2 } from "lucide-react";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard-layout";
import { mockProducts, type Product, type Category } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { suggestProductCategories, type SuggestProductCategoriesOutput } from "@/ai/flows/suggest-product-categories";
import { getCategories } from "@/lib/firebase/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(mockProducts);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isFormOpen, setFormOpen] = React.useState(false);
  const [isSuggesting, setSuggesting] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<SuggestProductCategoriesOutput | null>(null);
  const [productName, setProductName] = React.useState("");
  const [productDescription, setProductDescription] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchCategories() {
        try {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        } catch(e) {
            console.error(e);
            toast({
                title: "Error fetching categories",
                description: "Could not fetch product categories. Please try again.",
                variant: "destructive"
            })
        }
    }
    fetchCategories();
  }, [toast]);


  const handleSuggestCategories = async () => {
    if (!productName || !productDescription) {
      toast({
        title: "Missing Information",
        description: "Please enter a product name and description first.",
        variant: "destructive",
      });
      return;
    }
    setSuggesting(true);
    setSuggestions(null);
    try {
      const result = await suggestProductCategories({
        productName,
        productDescription,
        recentSalesData: "Wireless Headphones (50 sold), Organic Coffee Beans (120 sold)",
        trendingProducts: "Home office gadgets, eco-friendly products"
      });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not get suggestions from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSuggesting(false);
    }
  };
  
  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProduct: Product = {
        id: products.length + 1,
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        stock: parseInt(formData.get('stock') as string),
        category: selectedCategory || formData.get('category') as string,
        description: formData.get('description') as string,
        image: 'https://placehold.co/300x300.png',
    };
    setProducts(prev => [newProduct, ...prev]);
    setFormOpen(false);
    toast({
        title: "Product Added",
        description: `${newProduct.name} has been successfully added.`,
    })
  }

  return (
    <DashboardLayout>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Add New Product</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new product to your inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" className="col-span-3" onChange={e => setProductName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea id="description" name="description" className="col-span-3" onChange={e => setProductDescription(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input id="price" name="price" type="number" step="0.01" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">Stock</Label>
                                <Input id="stock" name="stock" type="number" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="col-span-4 -mb-2">
                                <Button type="button" variant="outline" size="sm" onClick={handleSuggestCategories} disabled={isSuggesting}>
                                    {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                    Suggest Categories with AI
                                </Button>
                            </div>
                             {suggestions && (
                                <div className="col-span-4 bg-muted/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium mb-2">AI Suggestions:</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {suggestions.suggestedCategories.map(cat => (
                                            <Badge key={cat} variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory(cat)}>{cat}</Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{suggestions.reasoning}</p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Product</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={product.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={product.image}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.category}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardLayout>
  );
}
