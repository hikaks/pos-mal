
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
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/firebase/categories";
import type { Category } from "@/lib/data";

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormOpen, setFormOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    try {
      if (isEditing && currentCategory) {
        await updateCategory(currentCategory.id, categoryData);
        toast({
          title: "Success",
          description: "Category updated successfully.",
        });
      } else {
        await addCategory(categoryData);
        toast({
          title: "Success",
          description: "Category added successfully.",
        });
      }
      fetchCategories();
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} category.`,
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setFormOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
        await deleteCategory(id);
        toast({
            title: "Success",
            description: "Category deleted successfully.",
        });
        fetchCategories();
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to delete category.",
            variant: "destructive",
        });
    }
  };

  const openAddDialog = () => {
    setCurrentCategory(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1" onClick={openAddDialog}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Category
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline">{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                         <DialogDescription>
                            Fill in the details for the category.
                        </DialogDescription>
                    </DialogHeader>
                     <form onSubmit={handleFormSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" className="col-span-3" defaultValue={currentCategory?.name} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea id="description" name="description" className="col-span-3" defaultValue={currentCategory?.description} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{isEditing ? 'Save Changes' : 'Add Category'}</Button>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DashboardLayout>
  );
}

