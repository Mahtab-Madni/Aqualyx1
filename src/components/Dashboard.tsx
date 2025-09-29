import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, FlaskConical, MapPin, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-water.jpg';

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const features = [
    {
      icon: FlaskConical,
      title: 'Automated Analysis',
      description: 'Calculate HPI, MI, and Cd indices automatically using validated scientific formulas.',
    },
    {
      icon: MapPin,
      title: 'Geospatial Mapping',
      description: 'Visualize contamination levels on interactive maps with color-coded markers.',
    },
    {
      icon: TrendingUp,
      title: 'Data Visualization',
      description: 'Generate comprehensive charts and reports for scientific analysis.',
    },
  ];

  const stats = [
    { label: 'Samples Analyzed', value: '1,247', icon: FlaskConical, trend: '+12%' },
    { label: 'Safe Locations', value: '892', icon: CheckCircle, trend: '+5%' },
    { label: 'High Risk Areas', value: '23', icon: AlertTriangle, trend: '-8%' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-hero shadow-elevated">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Scientific water analysis visualization"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-8 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Aqualyx
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">
              Advanced Groundwater Heavy Metal Contamination Assessment
            </p>
            <p className="text-lg text-primary-foreground/75 mb-8 max-w-2xl mx-auto">
              Automate the calculation of pollution indices (HPI, MI, Cd) for groundwater samples. 
              Designed for scientists, researchers, and policymakers to make data-driven environmental decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="tricolor" 
                size="lg"
                onClick={() => onSectionChange('upload')}
                className="text-lg px-8 py-4"
              >
                Start Analysis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-data hover:shadow-elevated transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold scientific-heading">{stat.value}</p>
                    <p className="text-sm text-accent font-medium">{stat.trend}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-data rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="shadow-data hover:shadow-elevated transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 shadow-scientific">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="scientific-heading">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How It Works */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="scientific-heading text-2xl">How Aqualyx Works</CardTitle>
          <CardDescription>
            A streamlined workflow for groundwater contamination assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Upload Data', desc: 'Import CSV/Excel files with sample data' },
              { step: '2', title: 'Validate', desc: 'Automatic data validation and error detection' },
              { step: '3', title: 'Analyze', desc: 'Calculate pollution indices automatically' },
              { step: '4', title: 'Visualize', desc: 'Generate maps, charts, and reports' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-4 text-primary-foreground font-bold text-lg shadow-scientific">
                  {item.step}
                </div>
                <h3 className="font-semibold scientific-heading mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;