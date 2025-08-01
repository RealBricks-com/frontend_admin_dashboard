import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, FileText, Receipt, TrendingUp, DollarSign } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { DeveloperCoreResponseDTO, LeadDTO, InvoiceDTO, ProjectCoreDTO } from "@/types/api";

interface DashboardStats {
  totalDevelopers: number;
  totalProjects: number;
  totalLeads: number;
  totalInvoices: number;
  pendingLeads: number;
  overdueInvoices: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDevelopers: 0,
    totalProjects: 0,
    totalLeads: 0,
    totalInvoices: 0,
    pendingLeads: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all required data
        const [developers, projects, leads, invoices] = await Promise.all([
          apiClient.get<DeveloperCoreResponseDTO[]>("/api/developers"),
          apiClient.get<ProjectCoreDTO[]>("/admin/project-cores"),
          apiClient.get<LeadDTO[]>("/admin/leads"),
          apiClient.get<InvoiceDTO[]>("/admin/invoices"),
        ]);

        // Calculate stats
        const pendingLeads = leads.filter(lead => lead.leadStatus === "PENDING").length;
        const overdueInvoices = invoices.filter(invoice => 
          invoice.paymentStatus === "PENDING" && new Date(invoice.dueDate) < new Date()
        ).length;
        const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

        setStats({
          totalDevelopers: developers.length,
          totalProjects: projects.length,
          totalLeads: leads.length,
          totalInvoices: invoices.length,
          pendingLeads,
          overdueInvoices,
          totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Developers",
      value: stats.totalDevelopers,
      description: "Registered developers",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Active Projects",
      value: stats.totalProjects,
      description: "Real estate projects",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      description: `${stats.pendingLeads} pending`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Invoices",
      value: stats.totalInvoices,
      description: `${stats.overdueInvoices} overdue`,
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      description: "All time revenue",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Growth Rate",
      value: "12.5%",
      description: "Month over month",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your estate management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isLoading ? "..." : card.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">New developer registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="outline">New</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-950 rounded-md">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Project approved</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
                <Badge variant="outline">Updated</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-md">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">New lead generated</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
                <Badge variant="outline">Lead</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-gradient-primary rounded-lg text-left transition-all hover:scale-105">
                <Building2 className="h-6 w-6 text-white mb-2" />
                <p className="text-sm font-medium text-white">Add Developer</p>
              </button>
              
              <button className="p-4 bg-gradient-card rounded-lg text-left transition-all hover:scale-105">
                <FileText className="h-6 w-6 text-card-foreground mb-2" />
                <p className="text-sm font-medium text-card-foreground">New Project</p>
              </button>
              
              <button className="p-4 bg-gradient-card rounded-lg text-left transition-all hover:scale-105">
                <Users className="h-6 w-6 text-card-foreground mb-2" />
                <p className="text-sm font-medium text-card-foreground">Manage Leads</p>
              </button>
              
              <button className="p-4 bg-gradient-card rounded-lg text-left transition-all hover:scale-105">
                <Receipt className="h-6 w-6 text-card-foreground mb-2" />
                <p className="text-sm font-medium text-card-foreground">Generate Invoice</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}