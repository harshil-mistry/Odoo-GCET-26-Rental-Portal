export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 pt-20">

      <main className="text-center space-y-8 p-4 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent animate-pulse">
            SmartRent
          </h1>
          <p className="text-xl text-muted-foreground">
            Next-Generation Rental Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Inventory Logic</h3>
            <p className="text-sm text-muted-foreground">
              Complex overlapping date checks for rentals.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center mb-4 text-secondary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Dynamic Pricing</h3>
            <p className="text-sm text-muted-foreground">
              AI-driven pricing based on demand and stock.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
            Get Started
          </button>
        </div>

        <div className="text-sm font-mono p-4 bg-muted rounded-lg mt-8">
          Check Theme Toggle ↗ (Top Right)
        </div>
      </main>
    </div>
  );
}
