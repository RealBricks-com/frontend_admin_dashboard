import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Building, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { ProjectCoreDTO, ProjectCoreCreateDTO, DeveloperCoreResponseDTO } from "@/types/api";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectCoreDTO[]>([]);
  const [developers, setDevelopers] = useState<DeveloperCoreResponseDTO[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectCoreDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectCoreDTO | null>(null);
  const [formData, setFormData] = useState({
    reraId: "",
    name: "",
    slug: "",
    description: "",
    developerId: "",
    areaId: "",
    propertyType: "",
    carpetAreaSqft: "",
    minPrice: "",
    status: "",
  });

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.reraId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<ProjectCoreDTO[]>("/admin/project-cores");
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const data = await apiClient.get<DeveloperCoreResponseDTO[]>("/api/developers");
      setDevelopers(data);
    } catch (error) {
      console.error("Failed to fetch developers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        const updateData: ProjectCoreDTO = {
          ...editingProject,
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          developerId: parseInt(formData.developerId),
          areaId: parseInt(formData.areaId),
          propertyType: formData.propertyType,
          carpetAreaSqft: parseInt(formData.carpetAreaSqft),
          minPrice: parseFloat(formData.minPrice),
          status: formData.status,
        };
        
        await apiClient.put<ProjectCoreDTO>(`/admin/project-cores/${editingProject.id}`, updateData);
        
        toast({
          title: "Project Updated",
          description: "Project information has been updated successfully.",
        });
      } else {
        const createData: ProjectCoreCreateDTO = {
          reraId: formData.reraId,
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          developerId: parseInt(formData.developerId),
          areaId: parseInt(formData.areaId),
          propertyType: formData.propertyType,
          carpetAreaSqft: parseInt(formData.carpetAreaSqft),
          minPrice: parseFloat(formData.minPrice),
          status: formData.status,
        };
        
        await apiClient.post<ProjectCoreDTO>("/admin/project-cores", createData);
        
        toast({
          title: "Project Created",
          description: "New project has been created successfully.",
        });
      }
      
      fetchProjects();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const handleEdit = (project: ProjectCoreDTO) => {
    setEditingProject(project);
    setFormData({
      reraId: project.reraId,
      name: project.name,
      slug: project.slug,
      description: project.description,
      developerId: project.developerId.toString(),
      areaId: project.areaId.toString(),
      propertyType: project.propertyType,
      carpetAreaSqft: project.carpetAreaSqft.toString(),
      minPrice: project.minPrice.toString(),
      status: project.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await apiClient.delete(`/admin/project-cores/${id}`);
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
      });
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      reraId: "",
      name: "",
      slug: "",
      description: "",
      developerId: "",
      areaId: "",
      propertyType: "",
      carpetAreaSqft: "",
      minPrice: "",
      status: "",
    });
    setEditingProject(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage real estate projects and their details
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
              <DialogDescription>
                {editingProject 
                  ? "Update the project information below." 
                  : "Enter the project information below."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reraId">RERA ID</Label>
                  <Input
                    id="reraId"
                    value={formData.reraId}
                    onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
                    placeholder="Enter RERA ID"
                    required
                    disabled={!!editingProject}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Enter project slug"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developerId">Developer</Label>
                  <Select value={formData.developerId} onValueChange={(value) => setFormData({ ...formData, developerId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {developers.map((developer) => (
                        <SelectItem key={developer.id} value={developer.id.toString()}>
                          {developer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carpetAreaSqft">Carpet Area (sq ft)</Label>
                  <Input
                    id="carpetAreaSqft"
                    type="number"
                    value={formData.carpetAreaSqft}
                    onChange={(e) => setFormData({ ...formData, carpetAreaSqft: e.target.value })}
                    placeholder="Enter carpet area"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minPrice">Minimum Price</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    step="0.01"
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                    placeholder="Enter minimum price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="areaId">Area ID</Label>
                  <Input
                    id="areaId"
                    type="number"
                    value={formData.areaId}
                    onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                    placeholder="Enter area ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="under_construction">Under Construction</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  {editingProject ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Projects List
          </CardTitle>
          <CardDescription>
            Total {projects.length} projects registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, RERA ID, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RERA ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Badge variant="outline">{project.reraId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="capitalize">{project.propertyType}</TableCell>
                    <TableCell>{project.carpetAreaSqft} sq ft</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {project.minPrice.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
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

          {!isLoading && filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No projects match your search." : "No projects found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}