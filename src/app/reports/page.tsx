
"use client";

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { getTransactions } from "@/lib/firebase/transactions";
import type { TransactionDetail, Product } from "@/lib/data";
import { getProducts } from "@/lib/firebase/products";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BrainCircuit } from "lucide-react";
import { analyzeSalesTrends, type SalesAnalysis } from "@/ai/flows/analyze-sales-trends";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type SalesData = {
  name: string;
  total: number;
};

export default function ReportsPage() {
  const [transactions, setTransactions] = React.useState<TransactionDetail[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<SalesAnalysis | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedTransactions, fetchedProducts] = await Promise.all([
          getTransactions(),
          getProducts(),
        ]);
        setTransactions(fetchedTransactions);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch data for reports.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleAnalyzeSales = async () => {
    if (!transactions.length) {
      toast({
        title: "No Data",
        description: "Not enough transaction data to perform analysis.",
        variant: "destructive",
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeSalesTrends({ transactions, language: selectedLanguage });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "AI Analysis Failed",
        description: "Could not analyze sales trends. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const salesByProduct = React.useMemo(() => {
    const salesMap: { [key: string]: number } = {};
    transactions.forEach((t) => {
      t.items.forEach((item) => {
        salesMap[item.name] = (salesMap[item.name] || 0) + item.price * item.quantity;
      });
    });
    return Object.entries(salesMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 products
  }, [transactions]);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalSales = transactions.length;
  const bestSellingProduct = salesByProduct[0];

  const renderChart = (data: SalesData[]) => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
            contentStyle={{ 
                background: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
            }}
            cursor={{fill: "hsl(var(--muted))"}}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <DashboardLayout>
       {isLoading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
            <div className="flex items-center">
                <h1 className="text-2xl font-headline">Sales Reports</h1>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <Label htmlFor="language-select">Analysis Language</Label>
                       <Select onValueChange={setSelectedLanguage} defaultValue={selectedLanguage}>
                            <SelectTrigger id="language-select" className="w-[180px]">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Indonesian">Indonesian</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAnalyzeSales} disabled={isAnalyzing}>
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                        {isAnalyzing ? "Analyzing..." : "Get AI Insights"}
                    </Button>
                </div>
            </div>

            {isAnalyzing && (
                <Card>
                    <CardHeader>
                        <CardTitle>AI Sales Analysis</CardTitle>
                        <CardDescription>Our AI is analyzing your sales data to uncover trends and predictions.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-48">
                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            )}

            {analysis && (
                 <Card className="bg-secondary border-primary/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-primary flex items-center gap-2"><BrainCircuit/> AI Sales Analysis & Predictions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Sales Prediction</h3>
                            <p className="text-sm text-muted-foreground">{analysis.salesPrediction}</p>
                        </div>
                        <div className="space-y-2">
                             <h3 className="font-semibold">Trend Analysis</h3>
                            <p className="text-sm text-muted-foreground">{analysis.trendAnalysis}</p>
                        </div>
                        <div className="space-y-2">
                             <h3 className="font-semibold">Peak Sales Time</h3>
                            <p className="text-sm text-muted-foreground">{analysis.peakSalesTime}</p>
                        </div>
                        <div className="space-y-2 col-span-full">
                            <h3 className="font-semibold">Top Performing Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.topPerformingCategories.map(cat => <Badge key={cat} variant="default">{cat}</Badge>)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Revenue
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">${totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                    From {totalSales} transactions
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Sales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">+{totalSales}</div>
                    <p className="text-xs text-muted-foreground">
                    Number of transactions recorded
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Best Seller</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-headline">{bestSellingProduct?.name || "N/A"}</div>
                    <p className="text-xs text-muted-foreground">
                    Top product by revenue
                    </p>
                </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Top Selling Products by Revenue</CardTitle>
                        <CardDescription>An overview of the top 10 products generating the most revenue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {salesByProduct.length > 0 ? renderChart(salesByProduct) : <p className="text-center text-muted-foreground py-12">No sales data available to display chart.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </DashboardLayout>
  );
}
