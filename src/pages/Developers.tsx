import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Building2, Mail, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { DeveloperCoreResponseDTO, DeveloperCoreCreateDTO, DeveloperCoreUpdateDTO } from "@/types/api";

export default function Developers() {
  const [developers, setDevelopers] = useState<DeveloperCoreResponseDTO[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<DeveloperCoreResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<DeveloperCoreResponseDTO | null>(null);
  const [formData, setFormData] = useState({
    reraId: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchDevelopers();
  }, []);

  useEffect(() => {
    const filtered = developers.filter(
      (developer) =>
        developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        developer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        developer.reraId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevelopers(filtered);
  }, [developers, searchTerm]);

  const fetchDevelopers = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<DeveloperCoreResponseDTO[]>("/api/developers");
      setDevelopers(data);
    } catch (error) {
      console.error("Failed to fetch developers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDeveloper) {
        // Update existing developer
        const updateData: DeveloperCoreUpdateDTO = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        };
        
        await apiClient.put<DeveloperCoreResponseDTO>(
          `/api/developers/${editingDeveloper.id}`,
          updateData
        );
        
        toast({
          title: "Developer Updated",
          description: "Developer information has been updated successfully.",
        });
      } else {
        // Create new developer
        const createData: DeveloperCoreCreateDTO = formData;
        
        await apiClient.post<DeveloperCoreResponseDTO>("/api/developers", createData);
        
        toast({
          title: "Developer Created",
          description: "New developer has been created successfully.",
        });
      }
      
      fetchDevelopers();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save developer:", error);
    }
  };

  const handleEdit = (developer: DeveloperCoreResponseDTO) => {
    setEditingDeveloper(developer);
    setFormData({
      reraId: developer.reraId,
      name: developer.name,
      email: developer.email,
      phone: developer.phone,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this developer?")) return;
    
    try {
      await apiClient.delete(`/api/developers/${id}`);
      toast({
        title: "Developer Deleted",
        description: "Developer has been deleted successfully.",
      });
      fetchDevelopers();
    } catch (error) {
      console.error("Failed to delete developer:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      reraId: "",
      name: "",
      email: "",
      phone: "",
    });
    setEditingDeveloper(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Developers</h1>
          <p className="text-muted-foreground mt-2">
            Manage real estate developers and their information
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Developer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDeveloper ? "Edit Developer" : "Add New Developer"}
              </DialogTitle>
              <DialogDescription>
                {editingDeveloper 
                  ? "Update the developer information below." 
                  : "Enter the developer information below."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reraId">RERA ID</Label>
                <Input
                  id="reraId"
                  value={formData.reraId}
                  onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
                  placeholder="Enter RERA ID"
                  required
                  disabled={!!editingDeveloper}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Developer Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter developer name"
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
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
                  {editingDeveloper ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Developers List
          </CardTitle>
          <CardDescription>
            Total {developers.length} developers registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search developers by name, email, or RERA ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading developers...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RERA ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevelopers.map((developer) => (
                  <TableRow key={developer.id}>
                    <TableCell>
                      <Badge variant="outline">{developer.reraId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{developer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {developer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {developer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(developer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(developer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(developer.id)}
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

          {!isLoading && filteredDevelopers.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No developers match your search." : "No developers found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}