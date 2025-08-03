
"use client";

import { useState, useEffect } from "react";
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
import { mockProducts, type Product } from "@/lib/data";
import type { Category } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { suggestProductDescription, type SuggestProductDescriptionOutput } from "@/ai/flows/suggest-product-description";
import { getCategories } from "@/lib/firebase/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSuggesting, setSuggesting] = useState(false);
  const [suggestedDescription, setSuggestedDescription] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productKeywords, setProductKeywords] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
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


  const handleSuggestDescription = async () => {
    if (!productName) {
      toast({
        title: "Missing Information",
        description: "Please enter a product name first.",
        variant: "destructive",
      });
      return;
    }
    setSuggesting(true);
    setSuggestedDescription(null);
    try {
      const result = await suggestProductDescription({
        productName,
        keywords: productKeywords,
      });
      if (result.description) {
        setProductDescription(result.description);
        setSuggestedDescription(result.description);
      }
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
        category: selectedCategory || "Uncategorized",
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
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-headline">Products</h1>
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
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Add New Product</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new product. Use the AI assistant to get category suggestions.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct}>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" name="name" placeholder="e.g. Espresso Machine" onChange={e => setProductName(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                     <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                             <div className="space-y-2">
                                <Label htmlFor="keywords">Keywords for AI</Label>
                                <Input id="keywords" name="keywords" placeholder="e.g. coffee, home, professional" onChange={e => setProductKeywords(e.target.value)} />
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Describe the product" value={productDescription} onChange={e => setProductDescription(e.target.value)} />
                                <Button type="button" variant="outline" size="sm" onClick={handleSuggestDescription} disabled={isSuggesting || !productName}>
                                    {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                    Suggest Description with AI
                                </Button>
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" type="number" step="0.01" placeholder="e.g. 299.99" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input id="stock" name="stock" type="number" placeholder="e.g. 15" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Product</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      <Card>
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
                    data-ai-hint="product image"
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
      </Card>
    </DashboardLayout>
  );
}
