
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Receipt, Search, Calendar as CalendarIcon, FileDown } from "lucide-react";
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { format, parse } from "date-fns";
import * as XLSX from 'xlsx';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
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
  
  const parseDate = (dateStr: string): Date => {
    try {
        return parse(dateStr, 'dd/MM/yyyy HH:mm', new Date());
    } catch(e) {
        return new Date(0);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        // Filter by search term (ID)
        if (searchTerm && !transaction.id.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        // Filter by date range
        if (dateRange?.from && dateRange?.to) {
          const transactionDate = parseDate(transaction.date);
          return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
        }
        return true;
      });
  }, [transactions, searchTerm, dateRange]);

  const handleExport = () => {
    const dataToExport = filteredTransactions.map(t => ({
        'Transaction ID': t.id,
        'Date': t.date,
        'Total': t.total,
        'Payment Method': t.paymentMethod,
        'Items': t.items.map(i => `${i.name} (x${i.quantity})`).join(', ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions_report.xlsx");
    toast({
        title: "Export Successful",
        description: "Transaction data has been exported to Excel."
    });
  };

  return (
    <DashboardLayout>
       <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedTransaction(null)}>
        <Card>
            <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>A list of all sales recorded in the system. You can filter by date and search by ID.</CardDescription>
            </CardHeader>
            <CardContent>
             <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by Transaction ID..."
                        className="pl-8 sm:w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className="w-[280px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date range</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                <Button onClick={handleExport} variant="outline" className="ml-auto">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export to Excel
                </Button>
             </div>
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
                    {filteredTransactions.map((transaction) => (
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
