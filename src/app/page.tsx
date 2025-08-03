
"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { mockProducts, type Product } from "@/lib/data";
import DashboardLayout from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Product {
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState(0);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const taxRate = 0.1; // 10% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  const change = cashReceived > total ? cashReceived - total : 0;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add products to the cart before checkout.",
        variant: "destructive"
      });
      return;
    }
    console.log("Processing transaction:", {
      cart,
      subtotal,
      taxAmount,
      total,
      paymentMethod,
    });
    setCart([]);
    setCashReceived(0);
    setCheckoutOpen(false);
    toast({
      title: "Transaction Complete",
      description: "The sale has been successfully processed.",
    });
  };

  return (
    <DashboardLayout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {mockProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                   <Image
                    alt={product.name}
                    className="aspect-square w-full rounded-t-lg object-cover"
                    data-ai-hint="product image"
                    height="200"
                    src={product.image}
                    width="200"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="sticky top-16">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Shopping Cart</CardTitle>
              <Badge variant="secondary">{cart.length} items</Badge>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground">Your cart is empty</p>
              ) : (
                <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          alt={item.name}
                          className="rounded-md"
                          height="48"
                          src={item.image}
                          width="48"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                         <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleUpdateQuantity(item.id, 0)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (10%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={cart.length === 0}>Checkout</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-headline">Checkout</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center text-4xl font-bold font-headline">${total.toFixed(2)}</div>
                    <RadioGroup defaultValue="cash" onValueChange={setPaymentMethod}>
                      <div className="grid grid-cols-3 gap-4">
                        <Label htmlFor="cash" className="border rounded-md p-4 text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                          <RadioGroupItem value="cash" id="cash" className="sr-only"/>
                          Cash
                        </Label>
                         <Label htmlFor="card" className="border rounded-md p-4 text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                          <RadioGroupItem value="card" id="card" className="sr-only"/>
                          Card
                        </Label>
                         <Label htmlFor="ewallet" className="border rounded-md p-4 text-center cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                          <RadioGroupItem value="ewallet" id="ewallet" className="sr-only"/>
                          E-Wallet
                        </Label>
                      </div>
                    </RadioGroup>
                    {paymentMethod === "cash" && (
                      <div className="space-y-2">
                        <Label htmlFor="cash-received">Cash Received</Label>
                        <Input id="cash-received" type="number" placeholder="Enter amount" onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)} />
                        {cashReceived > 0 && (
                          <div className="text-right font-medium">
                            Change: ${change.toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCheckout} className="w-full">Confirm Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
}
