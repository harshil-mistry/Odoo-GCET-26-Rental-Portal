import { VendorSidebar } from "@/components/vendor/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <aside className="hidden md:block h-screen sticky top-0">
                <VendorSidebar />
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                    <span className="font-semibold text-sm text-muted-foreground">Odoo GCET Hackathon</span>
                    <ThemeToggle />
                </header>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
