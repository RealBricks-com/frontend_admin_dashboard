import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, HeartHandshake } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { AmenityDTO } from "@/types/api";

export default function Amenities() {
  const [amenities, setAmenities] = useState<AmenityDTO[]>([]);
  const [filteredAmenities, setFilteredAmenities] = useState<AmenityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<AmenityDTO | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    const filtered = amenities.filter(
      (amenity) =>
        amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAmenities(filtered);
  }, [amenities, searchTerm]);

  const fetchAmenities = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<AmenityDTO[]>("/admin/amenities");
      setAmenities(data);
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAmenity) {
        const updateData: AmenityDTO = {
          ...editingAmenity,
          name: formData.name,
          category: formData.category,
        };
        
        await apiClient.put<AmenityDTO>(`/admin/amenities/${editingAmenity.id}`, updateData);
        
        toast({
          title: "Amenity Updated",
          description: "Amenity information has been updated successfully.",
        });
      } else {
        const createData: AmenityDTO = {
          id: 0,
          name: formData.name,
          category: formData.category,
          createdAt: new Date().toISOString(),
        };
        
        await apiClient.post<AmenityDTO>("/admin/amenities", createData);
        
        toast({
          title: "Amenity Created",
          description: "New amenity has been created successfully.",
        });
      }
      
      fetchAmenities();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save amenity:", error);
    }
  };

  const handleEdit = (amenity: AmenityDTO) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      category: amenity.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;
    
    try {
      await apiClient.delete(`/admin/amenities/${id}`);
      toast({
        title: "Amenity Deleted",
        description: "Amenity has been deleted successfully.",
      });
      fetchAmenities();
    } catch (error) {
      console.error("Failed to delete amenity:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
    });
    setEditingAmenity(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security': return 'bg-red-500';
      case 'recreation': return 'bg-green-500';
      case 'wellness': return 'bg-blue-500';
      case 'convenience': return 'bg-purple-500';
      case 'sports': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Amenities</h1>
          <p className="text-muted-foreground mt-2">
            Manage property amenities and their categories
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Amenity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
              </DialogTitle>
              <DialogDescription>
                {editingAmenity 
                  ? "Update the amenity information below." 
                  : "Enter the amenity information below."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Amenity Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter amenity name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="recreation">Recreation</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="convenience">Convenience</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                  {editingAmenity ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5" />
            Amenities List
          </CardTitle>
          <CardDescription>
            Total {amenities.length} amenities in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search amenities by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading amenities...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAmenities.map((amenity) => (
                  <TableRow key={amenity.id}>
                    <TableCell>{amenity.id}</TableCell>
                    <TableCell className="font-medium">{amenity.name}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getCategoryColor(amenity.category)} text-white capitalize`}
                      >
                        {amenity.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(amenity.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(amenity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(amenity.id)}
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

          {!isLoading && filteredAmenities.length === 0 && (
            <div className="text-center py-8">
              <HeartHandshake className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No amenities match your search." : "No amenities found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}