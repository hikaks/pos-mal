
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
import { type Product, type Category } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { suggestProductDescription } from "@/ai/flows/suggest-product-description";
import { getCategories } from "@/lib/firebase/categories";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/firebase/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  const [isSuggesting, setSuggesting] = useState(false);
  
  // Form state
  const [productName, setProductName] = useState("");
  const [productKeywords, setProductKeywords] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");

  const { toast } = useToast();

  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error fetching data",
        description: "Could not fetch products and categories. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const resetForm = () => {
    setProductName("");
    setProductKeywords("");
    setProductDescription("");
    setSelectedCategory(undefined);
    setProductPrice("");
    setProductStock("");
    setCurrentProduct(null);
    setIsEditing(false);
  };

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
    try {
      const result = await suggestProductDescription({
        productName,
        keywords: productKeywords,
      });
      if (result.description) {
        setProductDescription(result.description);
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

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const productData = {
      name: productName,
      price: parseFloat(productPrice),
      stock: parseInt(productStock),
      category: selectedCategory || "Uncategorized",
      description: productDescription,
      image: currentProduct?.image || 'https://placehold.co/300x300.png',
    };

    try {
      if (isEditing && currentProduct) {
        await updateProduct(currentProduct.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
      } else {
        await addProduct(productData);
        toast({
          title: "Success",
          description: "Product added successfully.",
        });
      }
      fetchProductsAndCategories();
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} product.`,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsEditing(false);
    setFormOpen(true);
  };
  
  const openEditDialog = (product: Product) => {
    resetForm();
    setIsEditing(true);
    setCurrentProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setSelectedCategory(product.category);
    setProductPrice(product.price.toString());
    setProductStock(product.stock.toString());
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteProduct(id);
        toast({
            title: "Success",
            description: "Product deleted successfully.",
        });
        fetchProductsAndCategories();
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to delete product.",
            variant: "destructive",
        });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-headline">Products</h1>
        <div className="ml-auto flex items-center gap-2">
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
              setFormOpen(isOpen);
              if (!isOpen) {
                resetForm();
              }
            }}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1" onClick={openAddDialog}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline">{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                            Fill in the details below. Use the AI assistant to suggest a description.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit}>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" name="name" placeholder="e.g. Espresso Machine" value={productName} onChange={e => setProductName(e.target.value)} />
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
                                <Input id="keywords" name="keywords" placeholder="e.g. coffee, home, professional" value={productKeywords} onChange={e => setProductKeywords(e.target.value)} />
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
                                    <Input id="price" name="price" type="number" step="0.01" placeholder="e.g. 299.99" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input id="stock" name="stock" type="number" placeholder="e.g. 15" value={productStock} onChange={e => setProductStock(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Add Product'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
      <Card>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
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
                <TableCell>
                  <Badge variant={product.stock > 10 ? 'secondary' : 'destructive'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </TableCell>
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
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
      </Card>
      )}
    </DashboardLayout>
  );
}
