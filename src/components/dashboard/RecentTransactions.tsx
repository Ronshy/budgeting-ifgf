import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, ShoppingBag, Coffee, Home, Zap } from "lucide-react"

const transactions = [
  {
    id: 1,
    title: "Grocery Store",
    category: "Food",
    amount: -120.50,
    date: "Today, 10:23 AM",
    icon: ShoppingBag,
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    id: 2,
    title: "Salary Deposit",
    category: "Income",
    amount: 4000.00,
    date: "Yesterday, 09:00 AM",
    icon: ArrowDownRight,
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    id: 3,
    title: "Electric Bill",
    category: "Utilities",
    amount: -85.20,
    date: "Mon, 2:15 PM",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    id: 4,
    title: "Coffee Shop",
    category: "Food",
    amount: -4.50,
    date: "Sun, 8:45 AM",
    icon: Coffee,
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    id: 5,
    title: "Rent Payment",
    category: "Housing",
    amount: -1200.00,
    date: "1st May, 10:00 AM",
    icon: Home,
    color: "bg-indigo-500/10 text-indigo-500"
  }
]

export function RecentTransactions() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <button className="text-sm font-medium text-primary hover:underline">View All</button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${transaction.color}`}>
                  <transaction.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{transaction.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{transaction.date}</p>
                </div>
              </div>
              <div className={`font-semibold ${transaction.amount > 0 ? "text-emerald-500" : ""}`}>
                {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
