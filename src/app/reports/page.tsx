
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
import type { TransactionDetail } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BrainCircuit } from "lucide-react";
import { analyzeSalesTrends, type SalesAnalysis } from "@/ai/flows/analyze-sales-trends";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  startOfToday,
  startOfMonth,
  isWithinInterval,
} from 'date-fns';

type SalesData = {
  name: string;
  total: number;
};

type ReportPeriod = "all" | "today" | "month";

export default function ReportsPage() {
  const [allTransactions, setAllTransactions] = React.useState<TransactionDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<SalesAnalysis | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const [aiKeywords, setAiKeywords] = React.useState("");
  const [reportPeriod, setReportPeriod] = React.useState<ReportPeriod>("all");
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedTransactions = await getTransactions();
        setAllTransactions(fetchedTransactions);
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

  const filteredTransactions = React.useMemo(() => {
    const now = new Date();
    const today = startOfToday();
    const monthStart = startOfMonth(now);

    const parseDate = (dateStr: string): Date => {
      const [datePart, timePart] = dateStr.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    };

    if (reportPeriod === "today") {
      return allTransactions.filter(t => isWithinInterval(parseDate(t.date), { start: today, end: now }));
    }
    if (reportPeriod === "month") {
      return allTransactions.filter(t => isWithinInterval(parseDate(t.date), { start: monthStart, end: now }));
    }
    return allTransactions;
  }, [allTransactions, reportPeriod]);

  const handleAnalyzeSales = async () => {
    if (!filteredTransactions.length) {
      toast({
        title: "No Data",
        description: "Not enough transaction data to perform analysis for the selected period.",
        variant: "destructive",
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeSalesTrends({ transactions: filteredTransactions, language: selectedLanguage, keywords: aiKeywords });
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
    filteredTransactions.forEach((t) => {
      t.items.forEach((item) => {
        salesMap[item.name] = (salesMap[item.name] || 0) + item.price * item.quantity;
      });
    });
    return Object.entries(salesMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 products
  }, [filteredTransactions]);

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalSales = filteredTransactions.length;
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
        <Tabs defaultValue="all" onValueChange={(value) => setReportPeriod(value as ReportPeriod)}>
          <div className="flex items-center mb-4">
            <h1 className="text-2xl font-headline">Sales Reports</h1>
            <div className="ml-auto">
               <TabsList>
                  <TabsTrigger value="all">All Time</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
            </div>
          </div>
          <TabsContent value={reportPeriod} className="space-y-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>AI-Powered Analysis</CardTitle>
                        <CardDescription>Get deeper insights with AI. Enter keywords to focus the analysis.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <Input 
                            placeholder="Optional: e.g., 'weekend sales', 'best drink'"
                            className="w-[300px]"
                            value={aiKeywords}
                            onChange={(e) => setAiKeywords(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                           <Label htmlFor="language-select" className="sr-only">Analysis Language</Label>
                           <Select onValueChange={setSelectedLanguage} defaultValue={selectedLanguage}>
                                <SelectTrigger id="language-select" className="w-[120px]">
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
                            {isAnalyzing ? "Analyzing..." : "Get Insights"}
                        </Button>
                    </div>
                </CardHeader>

                {isAnalyzing && (
                    <CardContent className="flex justify-center items-center h-48">
                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                )}

                {analysis && (
                     <CardContent>
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
                     </CardContent>
                )}
            </Card>

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
                        <CardDescription>An overview of the top 10 products generating the most revenue for the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {salesByProduct.length > 0 ? renderChart(salesByProduct) : <p className="text-center text-muted-foreground py-12">No sales data available to display chart for this period.</p>}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
}
