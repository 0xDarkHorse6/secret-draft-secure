import { Header } from "@/components/Header";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardComponent />
    </div>
  );
};

export default Dashboard;