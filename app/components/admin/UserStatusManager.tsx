"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, UserCheck, UserX, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: string;
  accountStatus: string;
  isActive: boolean;
  blockedAt: Date | null;
  blockedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
    orders: number;
    vendors: number;
  };
}

interface UserStatusManagerProps {}

export function UserStatusManager({}: UserStatusManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updating, setUpdating] = useState(false);
  
  // Form states
  const [newStatus, setNewStatus] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [blockedReason, setBlockedReason] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/users?status=${statusFilter}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, setUsers, setLoading]);

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, fetchUsers]);

  const handleStatusUpdate = async () => {
    if (!selectedUser || !newStatus) return;

    setUpdating(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          accountStatus: newStatus,
          isActive,
          blockedReason: newStatus === "BLOCKED" ? blockedReason : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user status");
      }

      const updatedUser = await response.json();
      
      // Update the users list
      setUsers(users.map(user => 
        user.id === updatedUser.id 
          ? { ...user, ...updatedUser }
          : user
      ));
      
      toast.success("User status updated successfully");
      setIsDialogOpen(false);
      setSelectedUser(null);
      setNewStatus("");
      setBlockedReason("");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user status");
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateDialog = (user: User) => {
    setSelectedUser(user);
    setNewStatus(user.accountStatus);
    setIsActive(user.isActive);
    setBlockedReason(user.blockedReason || "");
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="default">Approved</Badge>;
      case "BLOCKED":
        return <Badge variant="destructive">Blocked</Badge>;
      case "SUSPENDED":
        return <Badge variant="outline">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="default"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case "VENDOR":
        return <Badge variant="outline">Vendor</Badge>;
      case "BUYER":
        return <Badge variant="secondary">Buyer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="status-filter">Account Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profileImage || "/default-avatar.png"}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.accountStatus, user.isActive)}
                        {user.blockedAt && (
                          <div className="text-xs text-red-600 mt-1">
                            Blocked: {format(new Date(user.blockedAt), "MMM dd, yyyy")}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user._count.products} products</div>
                          <div>{user._count.orders} orders</div>
                          {user._count.vendors > 0 && (
                            <div>{user._count.vendors} vendor accounts</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUpdateDialog(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
            <DialogDescription>
              {selectedUser && `Update the account status for ${selectedUser.firstName} ${selectedUser.lastName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-status">Account Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newStatus === "BLOCKED" && (
              <div>
                <Label htmlFor="blocked-reason">Reason for Blocking</Label>
                <Textarea
                  id="blocked-reason"
                  value={blockedReason}
                  onChange={(e) => setBlockedReason(e.target.value)}
                  placeholder="Enter reason for blocking this user..."
                  rows={3}
                />
              </div>
            )}

            {newStatus === "BLOCKED" && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="text-sm text-red-600">
                  Blocking this user will prevent them from creating or publishing products.
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={updating || !newStatus}
            >
              {updating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
