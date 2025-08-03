"use client";

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DashboardLayout from "@/components/dashboard-layout";
import { mockProducts, mockTransactions } from "@/lib/data";

const dailySalesData = [
    { name: "Espresso Machine", sales: 4 },
    { name: "Coffee Beans", sales: 12 },
    { name: "Headphones", sales: 2 },
    { name: "Yoga Mat", sales: 7 },
    { name: "Blender", sales: 5 },
];

const monthlySalesData = [
    { name: "Espresso Machine", sales: 50 },
    { name: "Coffee Beans", sales: 250 },
    { name: "Headphones", sales: 80 },
    { name: "Yoga Mat", sales: 120 },
    { name: "Blender", sales: 95 },
    { name: "Smart Watch", sales: 70 },
    { name: "Wallet", sales: 150 },
];


export default function ReportsPage() {
    
  const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.total, 0);
  const bestSellingProduct = mockProducts.reduce((prev, current) => (prev.stock < current.stock) ? prev : current);

  const renderChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
            contentStyle={{ 
                background: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
            }}
        />
        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <DashboardLayout>
      <Tabs defaultValue="monthly">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="daily">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">$4,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">+45</div>
                <p className="text-xs text-muted-foreground">
                  +12 from yesterday
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Today's Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderChart(dailySalesData)}
                </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="monthly">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{bestSellingProduct.name}</div>
                <p className="text-xs text-muted-foreground">
                  Top product this month
                </p>
              </CardContent>
            </Card>
          </div>
           <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Monthly Sales Overview</CardTitle>
                     <CardDescription>
                        An overview of product sales for the current month.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {renderChart(monthlySalesData)}
                </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
