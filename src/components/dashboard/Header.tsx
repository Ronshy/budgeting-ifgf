import { Search, Bell, Plus } from "lucide-react"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search transactions..."
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
        
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
        </button>
        
        <div className="h-9 w-9 overflow-hidden rounded-full border border-border bg-muted cursor-pointer">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User avatar" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
