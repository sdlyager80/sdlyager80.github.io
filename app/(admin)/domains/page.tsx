"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockTenants } from "@/data/mock/domains";
import { mockServices } from "@/data/mock/services";
import { Plus, Search, MoreVertical, Eye, Settings, Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTenants = mockTenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Domain Management"
        description="Manage all customer domains and their service configurations"
        actions={
          <Button className="bg-bloom-cyan hover:bg-bloom-cyan/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        }
      />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border-l-4 border-l-bloom-cyan shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-bloom-cyan/5">
              <TableHead className="font-semibold">Domain Name</TableHead>
              <TableHead className="font-semibold">Domain URL</TableHead>
              <TableHead className="font-semibold">Services</TableHead>
              <TableHead className="font-semibold">Users</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Activity</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => {
              const configuredServices = tenant.services.length;
              const totalServices = mockServices.length;
              const completionPercent = Math.round(
                (configuredServices / totalServices) * 100
              );

              return (
                <TableRow key={tenant.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-bloom-blue">{tenant.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {tenant.settings.features.includes("advanced-analytics") && (
                          <Badge variant="secondary" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-mono text-muted-foreground">
                      {tenant.domain}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{configuredServices}</span>
                      <span className="text-muted-foreground">/ {totalServices}</span>
                      <Badge
                        className={cn(
                          "text-xs",
                          completionPercent >= 75
                            ? "bg-bloom-green/10 text-bloom-green"
                            : completionPercent >= 50
                            ? "bg-bloom-yellow/20 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {completionPercent}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{tenant.activeUsers}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-bloom-green/10 text-bloom-green">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatRelativeTime(tenant.lastActivity || new Date())}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/domains/${tenant.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Clone Configuration
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-bloom-red">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Domain
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredTenants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No domains found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
