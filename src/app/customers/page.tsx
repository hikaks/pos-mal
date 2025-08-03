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
import { MoreHorizontal, PlusCircle, Loader2, BrainCircuit } from "lucide-react";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard-layout";
import { mockCustomers, mockCustomerPurchaseHistory, type Customer } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { analyzeCustomerHabits, type AnalyzeCustomerHabitsOutput } from "@/ai/flows/analyze-customer-habits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
    const [customers, setCustomers] = React.useState<Customer[]>(mockCustomers);
    const [isFormOpen, setFormOpen] = React.useState(false);
    const [isAnalysisOpen, setAnalysisOpen] = React.useState(false);
    const [isAnalyzing, setAnalyzing] = React.useState(false);
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
    const [analysisResult, setAnalysisResult] = React.useState<AnalyzeCustomerHabitsOutput | null>(null);
    const { toast } = useToast();

    const handleAnalyzeHabits = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setAnalysisOpen(true);
        setAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeCustomerHabits(mockCustomerPurchaseHistory);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            toast({
                title: "AI Analysis Failed",
                description: "Could not analyze customer habits. Please try again.",
                variant: "destructive",
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newCustomer: Customer = {
            id: customers.length + 1,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            avatar: 'https://placehold.co/40x40.png',
        };
        setCustomers(prev => [newCustomer, ...prev]);
        setFormOpen(false);
        toast({
            title: "Customer Added",
            description: `${newCustomer.name} has been successfully added.`,
        });
    };
  
    return (
      <DashboardLayout>
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Customer
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Add New Customer</DialogTitle>
                         <DialogDescription>
                            Fill in the details to add a new customer.
                        </DialogDescription>
                    </DialogHeader>
                     <form onSubmit={handleAddCustomer}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" name="email" type="email" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input id="phone" name="phone" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Customer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[64px] sm:table-cell">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={customer.name}
                    className="aspect-square rounded-full object-cover"
                    height="40"
                    src={customer.avatar}
                    width="40"
                  />
                </TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleAnalyzeHabits(customer)}>
                        <BrainCircuit className="h-4 w-4 mr-2" />
                        Analyze
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isAnalysisOpen} onOpenChange={setAnalysisOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-headline">AI Shopping Analysis for {selectedCustomer?.name}</DialogTitle>
                    <DialogDescription>
                        Insights based on customer's purchase history.
                    </DialogDescription>
                </DialogHeader>
                {isAnalyzing ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : analysisResult && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Overall Spending</span>
                                    <span className="font-bold text-lg">${analysisResult.overallSpending.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Loyalty Tier</span>
                                    <Badge style={{backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)'}}>{analysisResult.loyaltyTier}</Badge>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-2">Favorite Categories</span>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.favoriteCategories.map(cat => (
                                            <Badge key={cat} variant="secondary">{cat}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    {analysisResult.productRecommendations.map(rec => (
                                        <li key={rec}>{rec}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
      </DashboardLayout>
    );
  }
