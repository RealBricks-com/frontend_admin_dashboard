import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Users, DollarSign, Mail, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { LeadDTO, LeadCreateDTO } from "@/types/api";

export default function Leads() {
  const [leads, setLeads] = useState<LeadDTO[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadDTO | null>(null);
  const [formData, setFormData] = useState({
    projectId: "",
    developerId: "",
    userId: "",
    name: "",
    email: "",
    phone: "",
    budgetMin: "",
    budgetMax: "",
    leadStatus: "",
    leadScore: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const filtered = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.leadStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeads(filtered);
  }, [leads, searchTerm]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<LeadDTO[]>("/admin/leads");
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLead) {
        const updateData: LeadDTO = {
          ...editingLead,
          projectId: parseInt(formData.projectId),
          developerId: parseInt(formData.developerId),
          userId: parseInt(formData.userId),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          budgetMin: parseFloat(formData.budgetMin),
          budgetMax: parseFloat(formData.budgetMax),
          leadStatus: formData.leadStatus,
          leadScore: parseInt(formData.leadScore),
        };
        
        await apiClient.put<LeadDTO>(`/admin/leads/${editingLead.id}`, updateData);
        
        toast({
          title: "Lead Updated",
          description: "Lead information has been updated successfully.",
        });
      } else {
        const createData: LeadCreateDTO = {
          projectId: parseInt(formData.projectId),
          developerId: parseInt(formData.developerId),
          userId: parseInt(formData.userId),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          budgetMin: parseFloat(formData.budgetMin),
          budgetMax: parseFloat(formData.budgetMax),
          leadStatus: formData.leadStatus,
          leadScore: parseInt(formData.leadScore),
        };
        
        await apiClient.post<LeadDTO>("/admin/leads", createData);
        
        toast({
          title: "Lead Created",
          description: "New lead has been created successfully.",
        });
      }
      
      fetchLeads();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save lead:", error);
    }
  };

  const handleEdit = (lead: LeadDTO) => {
    setEditingLead(lead);
    setFormData({
      projectId: lead.projectId.toString(),
      developerId: lead.developerId.toString(),
      userId: lead.userId.toString(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      budgetMin: lead.budgetMin.toString(),
      budgetMax: lead.budgetMax.toString(),
      leadStatus: lead.leadStatus,
      leadScore: lead.leadScore.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      await apiClient.delete(`/admin/leads/${id}`);
      toast({
        title: "Lead Deleted",
        description: "Lead has been deleted successfully.",
      });
      fetchLeads();
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      projectId: "",
      developerId: "",
      userId: "",
      name: "",
      email: "",
      phone: "",
      budgetMin: "",
      budgetMax: "",
      leadStatus: "",
      leadScore: "",
    });
    setEditingLead(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-emerald-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-2">
            Manage sales leads and track their progress
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLead ? "Edit Lead" : "Add New Lead"}
              </DialogTitle>
              <DialogDescription>
                {editingLead 
                  ? "Update the lead information below." 
                  : "Enter the lead information below."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="leadStatus">Lead Status</Label>
                  <Select value={formData.leadStatus} onValueChange={(value) => setFormData({ ...formData, leadStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    type="number"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    placeholder="Enter project ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developerId">Developer ID</Label>
                  <Input
                    id="developerId"
                    type="number"
                    value={formData.developerId}
                    onChange={(e) => setFormData({ ...formData, developerId: e.target.value })}
                    placeholder="Enter developer ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    type="number"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="Enter user ID"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Budget Min</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    step="0.01"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    placeholder="Minimum budget"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Budget Max</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    step="0.01"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    placeholder="Maximum budget"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadScore">Lead Score (1-10)</Label>
                  <Input
                    id="leadScore"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.leadScore}
                    onChange={(e) => setFormData({ ...formData, leadScore: e.target.value })}
                    placeholder="Lead score"
                  />
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
                  {editingLead ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Leads List
          </CardTitle>
          <CardDescription>
            Total {leads.length} leads in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, phone, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Budget Range</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {lead.budgetMin.toLocaleString()} - {lead.budgetMax.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {lead.leadScore}/10
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getLeadStatusColor(lead.leadStatus)} text-white capitalize`}
                      >
                        {lead.leadStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(lead)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lead.id)}
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

          {!isLoading && filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No leads match your search." : "No leads found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}