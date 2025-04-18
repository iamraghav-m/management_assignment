
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, active, onClick }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export const DashboardLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      text: "Dashboard",
    },
    {
      href: "/documents",
      icon: <FileText size={20} />,
      text: "Documents",
    },
    {
      href: "/qa",
      icon: <HelpCircle size={20} />,
      text: "Q&A",
    }
  ];

  if (hasRole("admin")) {
    navItems.push({
      href: "/users",
      icon: <Users size={20} />,
      text: "Users",
    });
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="flex h-16 items-center gap-4 border-b px-4 md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-4">
              <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
                <FileText className="h-6 w-6 text-doc-blue" />
                <span>DocManager</span>
              </Link>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.text}
                  active={location.pathname === item.href}
                  onClick={closeMobileMenu}
                />
              ))}
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3 px-3"
                onClick={logout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <FileText className="h-6 w-6 text-doc-blue" />
          <span>DocManager</span>
        </Link>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <FileText className="h-6 w-6 text-doc-blue" />
            <span>DocManager</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.text}
              active={location.pathname === item.href}
            />
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between px-3 hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name}
                    />
                    <AvatarFallback>
                      {user?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.role}</p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="hidden h-16 items-center justify-between border-b px-6 md:flex">
          <h1 className="text-lg font-semibold">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/documents" && "Documents"}
            {location.pathname === "/users" && "User Management"}
            {location.pathname === "/qa" && "Questions & Answers"}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <main className="container py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
