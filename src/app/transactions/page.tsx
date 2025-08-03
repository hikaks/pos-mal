
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
import { Badge } from "@/components/ui/badge";
import { Loader2, Receipt } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { type TransactionDetail } from "@/lib/data";
import { getTransactions } from "@/lib/firebase/transactions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const fetchedTransactions = await getTransactions();
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast({
          title: "Error",
          description: "Could not fetch transactions.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [toast]);

  return (
    <DashboardLayout>
       <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedTransaction(null)}>
        <Card>
            <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>A list of all sales recorded in the system.</CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="text-right font-medium">${transaction.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{transaction.items.length}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{transaction.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                                    <Receipt className="mr-2 h-4 w-4" />
                                    View Details
                                </Button>
                            </DialogTrigger>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>

        {selectedTransaction && (
             <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline">Transaction Details</DialogTitle>
                     <p className="text-sm text-muted-foreground">ID: {selectedTransaction.id}</p>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        {selectedTransaction.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                                <p>${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <Separator />
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${selectedTransaction.subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>${selectedTransaction.taxAmount.toFixed(2)}</span>
                        </div>
                     </div>
                     <Separator />
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${selectedTransaction.total.toFixed(2)}</span>
                    </div>
                    <Separator />
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span>{selectedTransaction.paymentMethod}</span>
                        </div>
                         {selectedTransaction.paymentMethod === 'cash' && (
                             <>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cash Received</span>
                                    <span>${selectedTransaction.cashReceived?.toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">Change</span>
                                    <span>${selectedTransaction.change?.toFixed(2)}</span>
                                </div>
                             </>
                         )}
                    </div>
                </div>
            </DialogContent>
        )}
       </Dialog>
    </DashboardLayout>
  );
}
