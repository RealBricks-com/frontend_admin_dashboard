import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, UserCheck, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { AdminUserResponseDTO, AdminUserCreateRequestDTO } from "@/types/api";

export default function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUserResponseDTO[]>([]);
  const [filteredAdminUsers, setFilteredAdminUsers] = useState<AdminUserResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdminUser, setEditingAdminUser] = useState<AdminUserResponseDTO | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
    firstName: "",
    role: "",
  });

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  useEffect(() => {
    const filtered = adminUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdminUsers(filtered);
  }, [adminUsers, searchTerm]);

  const fetchAdminUsers = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<AdminUserResponseDTO[]>("/api/admin-users");
      setAdminUsers(data);
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAdminUser) {
        const updateData: AdminUserCreateRequestDTO = {
          email: formData.email,
          passwordHash: formData.passwordHash,
          firstName: formData.firstName,
          role: formData.role,
        };
        
        await apiClient.put<AdminUserResponseDTO>(`/api/admin-users/${editingAdminUser.id}`, updateData);
        
        toast({
          title: "Admin User Updated",
          description: "Admin user information has been updated successfully.",
        });
      } else {
        const createData: AdminUserCreateRequestDTO = {
          email: formData.email,
          passwordHash: formData.passwordHash,
          firstName: formData.firstName,
          role: formData.role,
        };
        
        await apiClient.post<AdminUserResponseDTO>("/api/admin-users", createData);
        
        toast({
          title: "Admin User Created",
          description: "New admin user has been created successfully.",
        });
      }
      
      fetchAdminUsers();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save admin user:", error);
    }
  };

  const handleEdit = (adminUser: AdminUserResponseDTO) => {
    setEditingAdminUser(adminUser);
    setFormData({
      email: adminUser.email,
      passwordHash: "",
      firstName: adminUser.firstName,
      role: adminUser.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;
    
    try {
      await apiClient.delete(`/api/admin-users/${id}`);
      toast({
        title: "Admin User Deleted",
        description: "Admin user has been deleted successfully.",
      });
      fetchAdminUsers();
    } catch (error) {
      console.error("Failed to delete admin user:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      passwordHash: "",
      firstName: "",
      role: "",
    });
    setEditingAdminUser(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin': return 'bg-red-500';
      case 'admin': return 'bg-blue-500';
      case 'manager': return 'bg-green-500';
      case 'editor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage admin users and their permissions
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAdminUser ? "Edit Admin User" : "Add New Admin User"}
              </DialogTitle>
              <DialogDescription>
                {editingAdminUser 
                  ? "Update the admin user information below." 
                  : "Enter the admin user information below."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passwordHash">Password</Label>
                <Input
                  id="passwordHash"
                  type="password"
                  value={formData.passwordHash}
                  onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                  placeholder={editingAdminUser ? "Leave blank to keep current" : "Enter password"}
                  required={!editingAdminUser}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingAdminUser ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Admin Users List
          </CardTitle>
          <CardDescription>
            Total {adminUsers.length} admin users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admin users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading admin users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.firstName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getRoleColor(user.role)} text-white capitalize`}
                      >
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredAdminUsers.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No admin users match your search." : "No admin users found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}