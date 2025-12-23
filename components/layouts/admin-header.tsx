"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BloomLogo } from "@/components/shared/bloom-logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, LogOut, User, Shield, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/platform" className="flex items-center gap-2">
            <BloomLogo />
            <Badge className="bg-bloom-blue text-white hover:bg-bloom-blue/90">
              Admin
            </Badge>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/platform"
              className={cn(
                "text-sm font-medium transition-colors hover:text-bloom-cyan",
                isActive("/platform")
                  ? "text-bloom-cyan font-semibold"
                  : "text-gray-700"
              )}
            >
              Platform Dashboard
            </Link>
            <Link
              href="/domains"
              className={cn(
                "text-sm font-medium transition-colors hover:text-bloom-cyan",
                isActive("/domains")
                  ? "text-bloom-cyan font-semibold"
                  : "text-gray-700"
              )}
            >
              Domain Management
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Select defaultValue="all-domains">
            <SelectTrigger className="w-[200px] border-bloom-cyan">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-bloom-cyan" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-domains">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>All Domains</span>
                </div>
              </SelectItem>
              <SelectItem value="bloom-corp">Bloom Insurance Corp</SelectItem>
              <SelectItem value="acme-ins">ACME Insurance</SelectItem>
              <SelectItem value="shield-life">Shield Life</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-bloom-blue text-white font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@bloominsurance.com
                  </p>
                  <Badge className="w-fit bg-bloom-blue text-white text-xs">
                    Platform Admin
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-bloom-red">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
