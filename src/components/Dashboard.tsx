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
    <div className="space-y-8 animate-fade-in bg-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-hero shadow-elevated dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-transform duration-300 hover:scale-105 hover:z-10">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Scientific water analysis visualization"
            className="w-full h-full object-cover opacity-20 dark:opacity-30"
          />
        </div>
        <div className="relative px-8 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 dark:text-white">
              Aqualyx
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 dark:text-gray-300">
              Advanced Groundwater Heavy Metal Contamination Assessment
            </p>
            <p className="text-lg text-primary-foreground/75 mb-8 max-w-2xl mx-auto dark:text-gray-400">
              Automate the calculation of pollution indices (HPI, MI, Cd) for groundwater samples. 
              Designed for scientists, researchers, and policymakers to make data-driven environmental decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => onSectionChange('upload')}
                className="text-lg px-8 py-4 bg-blue-600 text-white border-none hover:bg-blue-700 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-900"
              >
                Begin Assessment
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 bg-blue-600 text-white border-none hover:bg-blue-700 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-900"
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
            <Card
              key={index}
              className="shadow-data hover:shadow-elevated transition-transform duration-300 dark:bg-gray-900 dark:text-gray-100 hover:scale-105 hover:z-10"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold scientific-heading dark:text-white">{stat.value}</p>
                    <p className="text-sm text-accent font-medium dark:text-blue-400">{stat.trend}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-data rounded-lg dark:bg-gradient-to-br dark:from-blue-900 dark:to-gray-800">
                    <Icon className="h-6 w-6 text-primary dark:text-blue-400" />
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
            <Card
              key={index}
              className="shadow-data hover:shadow-elevated transition-transform duration-300 animate-slide-up dark:bg-gray-900 dark:text-gray-100 hover:scale-105 hover:z-10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 shadow-scientific dark:bg-gradient-to-br dark:from-blue-900 dark:to-gray-800">
                  <Icon className="h-8 w-8 text-primary-foreground dark:text-blue-400" />
                </div>
                <CardTitle className="scientific-heading dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground dark:text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How It Works */}
      <Card className="shadow-elevated dark:bg-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="scientific-heading text-2xl dark:text-white">How Aqualyx Works</CardTitle>
          <CardDescription className="dark:text-gray-400">
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
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-4 text-primary-foreground font-bold text-lg shadow-scientific dark:bg-gradient-to-br dark:from-blue-900 dark:to-gray-800 dark:text-blue-400">
                  {item.step}
                </div>
                <h3 className="font-semibold scientific-heading mb-2 dark:text-white">{item.title}</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;