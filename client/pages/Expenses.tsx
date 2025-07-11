import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  Fuel,
  DollarSign,
  Receipt,
  Plus,
  Calculator,
  FileText,
  TrendingDown,
  Calendar,
  CreditCard,
  MapPin,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Expenses() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock expense data
  const weeklyExpenses = [
    {
      category: "Fuel",
      amount: 145.67,
      count: 8,
      icon: Fuel,
      color: "florida-coral",
      deductible: 145.67,
    },
    {
      category: "Maintenance",
      amount: 89.99,
      count: 2,
      icon: Car,
      color: "florida-ocean",
      deductible: 89.99,
    },
    {
      category: "Insurance",
      amount: 87.5,
      count: 1,
      icon: FileText,
      color: "florida-palm",
      deductible: 52.5, // Partial business use
    },
    {
      category: "Phone/Data",
      amount: 25.0,
      count: 1,
      icon: CreditCard,
      color: "florida-sunset",
      deductible: 15.0, // Partial business use
    },
  ];

  const recentTransactions = [
    {
      date: "Dec 15",
      category: "Fuel",
      description: "Shell Station - Beach Blvd",
      amount: 42.33,
      mileage: 285,
      deductible: true,
    },
    {
      date: "Dec 14",
      category: "Fuel",
      description: "Wawa - Atlantic Blvd",
      amount: 38.95,
      mileage: 268,
      deductible: true,
    },
    {
      date: "Dec 13",
      category: "Maintenance",
      description: "Oil Change - Valvoline",
      amount: 45.99,
      mileage: 245,
      deductible: true,
    },
    {
      date: "Dec 12",
      category: "Fuel",
      description: "BP Station - Phillips Hwy",
      amount: 41.28,
      mileage: 201,
      deductible: true,
    },
    {
      date: "Dec 11",
      category: "Maintenance",
      description: "Car Wash - Touchless",
      amount: 12.0,
      mileage: 189,
      deductible: true,
    },
  ];

  const mileageData = {
    businessMiles: 425,
    personalMiles: 89,
    totalMiles: 514,
    mileageRate: 0.655, // 2024 IRS rate
    mileageDeduction: 425 * 0.655,
  };

  const taxSummary = {
    totalExpenses: weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    totalDeductible: weeklyExpenses.reduce(
      (sum, exp) => sum + exp.deductible,
      0,
    ),
    estimatedTaxSavings: 0, // Will calculate
  };
  taxSummary.estimatedTaxSavings =
    (taxSummary.totalDeductible + mileageData.mileageDeduction) * 0.22; // 22% tax bracket

  const totalExpenses = weeklyExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-florida-ocean/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Expenses</h1>
              <p className="text-xs text-muted-foreground">
                Track & optimize costs
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-florida-coral/20">
            <CardContent className="p-3 text-center">
              <TrendingDown className="w-6 h-6 text-florida-coral mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-coral">
                ${totalExpenses.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </CardContent>
          </Card>
          <Card className="border-florida-palm/20">
            <CardContent className="p-3 text-center">
              <Calculator className="w-6 h-6 text-florida-palm mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-palm">
                ${taxSummary.estimatedTaxSavings.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Tax Savings</div>
            </CardContent>
          </Card>
          <Card className="border-florida-ocean/20">
            <CardContent className="p-3 text-center">
              <MapPin className="w-6 h-6 text-florida-ocean mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-ocean">
                {mileageData.businessMiles}
              </div>
              <div className="text-xs text-muted-foreground">Bus. Miles</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="mileage">Mileage</TabsTrigger>
            <TabsTrigger value="taxes">Tax Info</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            {/* Expense Categories */}
            <Card className="border-florida-ocean/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-florida-ocean" />
                  Expense Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyExpenses.map((expense, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 bg-${expense.color}/20 rounded-lg flex items-center justify-center`}
                      >
                        <expense.icon
                          className={`w-5 h-5 text-${expense.color}`}
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{expense.category}</div>
                        <div className="text-sm text-muted-foreground">
                          {expense.count} transaction
                          {expense.count > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">
                        -${expense.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-green-600">
                        ${expense.deductible.toFixed(2)} deductible
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-florida-ocean/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-florida-ocean" />
                    Recent Transactions
                  </span>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {transaction.date}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs border-florida-ocean text-florida-ocean"
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                      <div className="text-sm">{transaction.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.mileage} miles
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">
                        -${transaction.amount.toFixed(2)}
                      </div>
                      {transaction.deductible && (
                        <div className="text-xs text-green-600">Deductible</div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mileage" className="space-y-4">
            {/* Mileage Tracking */}
            <Card className="border-florida-ocean/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-florida-ocean" />
                  Mileage Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-florida-ocean/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Business Miles
                    </div>
                    <div className="text-2xl font-bold text-florida-ocean">
                      {mileageData.businessMiles}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Personal Miles
                    </div>
                    <div className="text-2xl font-bold text-gray-600">
                      {mileageData.personalMiles}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-green-800">
                        Mileage Deduction
                      </div>
                      <div className="text-sm text-green-600">
                        {mileageData.businessMiles} miles × $
                        {mileageData.mileageRate}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      ${mileageData.mileageDeduction.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  * Based on 2024 IRS standard mileage rate of $
                  {mileageData.mileageRate} per mile
                </div>
              </CardContent>
            </Card>

            {/* Auto-tracking toggle would go here */}
            <Card className="border-florida-palm/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Auto-Track Mileage</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically track business miles while driving
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-4">
            {/* Tax Summary */}
            <Card className="border-florida-palm/20 bg-gradient-to-r from-white to-florida-palm/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-florida-palm" />
                  Tax Summary (This Week)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-semibold">
                      ${taxSummary.totalExpenses.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deductible Expenses</span>
                    <span className="font-semibold text-green-600">
                      ${taxSummary.totalDeductible.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mileage Deduction</span>
                    <span className="font-semibold text-green-600">
                      ${mileageData.mileageDeduction.toFixed(2)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Deductions</span>
                    <span className="font-bold text-green-700">
                      $
                      {(
                        taxSummary.totalDeductible +
                        mileageData.mileageDeduction
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Est. Tax Savings</span>
                    <span className="font-bold text-florida-palm">
                      ${taxSummary.estimatedTaxSavings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Florida Tax Info */}
            <Card className="border-florida-sunset/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-florida-sunset" />
                  Florida Tax Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white/60 rounded-lg">
                  <div className="font-semibold text-sm text-florida-sunset">
                    📋 No State Income Tax
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Florida has no state income tax - focus on federal
                    deductions
                  </div>
                </div>
                <div className="p-3 bg-white/60 rounded-lg">
                  <div className="font-semibold text-sm text-florida-ocean">
                    🚗 Vehicle Deductions
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Choose between actual expense method or standard mileage
                    rate
                  </div>
                </div>
                <div className="p-3 bg-white/60 rounded-lg">
                  <div className="font-semibold text-sm text-florida-palm">
                    📱 Technology Expenses
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Phone, data plan, and app subscriptions are deductible
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-12 bg-florida-ocean hover:bg-florida-ocean-dark text-white">
            <Receipt className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
          <Button
            variant="outline"
            className="h-12 border-florida-palm text-florida-palm hover:bg-florida-palm hover:text-white"
          >
            <FileText className="w-5 h-5 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}
