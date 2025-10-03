import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, MapPin, BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

// interface ResultsProps {
//   data: any[];
// }
interface Sample {
    sampleId: string;
    latitude: number;
    longitude: number;
    indices: {
      hpi: number;
      mi: number;
      cd: number;
    };
    category: 'safe' | 'moderate' | 'unsafe';
}
interface PollutionChartEntry {
  name: string;
  HPI: number;
  MI: number;
  Cd: number;
}
interface CategorySummary {
  name: string;
  value: number;
  color: string;
}

const Results: React.FC = () => {
  const navigate = useNavigate();
    const { toast } = useToast();
    const [data, setData] = useState<Sample[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [chartData, setChartData] = useState<PollutionChartEntry[]>([]);
    const [pieData, setPieData] = useState<CategorySummary[]>([]);
    const [totalSamples, setTotalSamples] = useState<number | null>(null);
    const [showAll, setShowAll] = useState(false);
    const visibleData = showAll ? data : data.slice(0, 15);

    useEffect(() => {
        axios
          .get('http://localhost:5000/api/charts/pollution-indices')
          .then((res) => {
            const formatted: PollutionChartEntry[] = res.data.map((entry: any) => ({
              name: entry._id,
              HPI: entry.avgHPI,
              MI: entry.avgMI,
              Cd: entry.avgCD,
            }));
            setChartData(formatted);
          })
          .catch((err) => {
            console.error('Failed to fetch chart data:', err);
            toast({ title: 'Chart data error', description: 'Unable to load pollution indices.' });
          });
    }, []);
  
    useEffect(() => {
        axios
          .get('http://localhost:5000/api/samples')
          .then((res) => {
            setData(res.data as Sample[]);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error fetching samples:', err);
            toast({ title: 'Sample fetch error', description: 'Unable to load sample data.' });
            setLoading(false);
          });
      }, []);
        
    useEffect(() => {
        axios
          .get('http://localhost:5000/api/summary')
          .then((res) => {
            const categories = res.data.categories;
            const total = res.data.totalSamples;
    
            const formatted: CategorySummary[] = categories.map((cat: any) => ({
              name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
              value: cat.count,
              color:
                cat._id === 'safe'
                  ? 'hsl(var(--safe))'
                  : cat._id === 'moderate'
                  ? 'hsl(var(--moderate))'
                  : 'hsl(var(--unsafe))',
            }));
    
            setPieData(formatted);
            setTotalSamples(total);
          })
          .catch((err) => {
            console.error('Failed to fetch category summary:', err);
            toast({ title: 'Summary error', description: 'Unable to load summary data.' });
          });
      }, []);
  
  const getVariant = (category: string) => {
    switch (category) {
      case 'safe': return 'safe';
      case 'moderate': return 'moderate';
      case 'unsafe': return 'unsafe';
      default: return 'default';
    }   
  };

  const handleDownloadReport = async () => {
    try {
    toast({
      title: 'Generating Report',
      description: 'Preparing your PDF report with charts and map...',
      variant: 'default',
    });

    // Capture chart and map images by ID
    const captureImage = async (id: string) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const canvas = await html2canvas(el);
      return canvas.toDataURL('image/png');
    };

    const pollutionChart = await captureImage('pollution-chart');
    const pieChart = await captureImage('pie-chart');
    const mapSnapshot = await captureImage('map-visual');

    // Send request to backend with chart images
    const response = await axios.post(
      'http://localhost:5000/api/export/pdf',
      {
        samples: data, // your sample array
        charts: {
          pollutionChart,
          pieChart,
          mapSnapshot,
        },
      },
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    saveAs(blob, 'Water_Analysis_Report.pdf');

    toast({
      title: 'Report Ready',
      description: 'Your PDF report has been downloaded.',
      variant: 'default',
    });
  } catch (error) {
    console.error('PDF download failed:', error);
    toast({
      title: 'Download Failed',
      description: 'Something went wrong while generating the report.',
      variant: 'destructive',
    });
  }
  };


const handleExportCSV = async () => {
  try {
    toast({
      title: 'Exporting Data',
      description: 'Preparing CSV file...',
      variant: 'default',
    });

    const response = await axios.get('http://localhost:5000/api/export/csv', {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Water_Analysis_Data.csv');

        toast({
          title: 'CSV Exported',
          description: 'Your data has been saved as CSV.',
        });
  } catch (error) {
    console.error('CSV export failed:', error);
    toast({
      title: 'Export Failed',
      description: 'Unable to export CSV data.',
      variant: 'destructive',
    });
  }
};

  return (
    <div className="space-y-8 animate-fade-in bg-gray-100 text-gray-900">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-data bg-white text-gray-900">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Samples</p>
              <p className="text-2xl font-bold scientific-heading">
                {totalSamples !== null ? totalSamples : 'Loading...'}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        {pieData.length === 3 ? (
              <>
                <Card className="shadow-data bg-white text-gray-900">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Safe Areas</p>
                      <p className="text-2xl font-bold text-safe">{pieData[0].value}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-safe" aria-label="Safe status indicator" />
                  </CardContent>
                </Card>
            
                <Card className="shadow-data bg-white text-gray-900">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Moderate Risk</p>
                      <p className="text-2xl font-bold text-moderate">{pieData[1].value}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-moderate" aria-label="Moderate status indicator" />
                  </CardContent>
                </Card>
            
                <Card className="shadow-data bg-white text-gray-900">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">High Risk</p>
                      <p className="text-2xl font-bold text-unsafe">{pieData[2].value}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-unsafe" aria-label="High risk alert icon" />
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className="text-muted-foreground">Loading category summary...</p>
            )}

      </div>

      {/* Data Table */}
      <Card className="shadow-elevated dark:bg-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="scientific-heading">Analysis Results</CardTitle>
          <CardDescription>Click a row to view detailed report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>HPI</TableHead>
                  <TableHead>MI</TableHead>
                  <TableHead>Cd</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...visibleData]
                  .sort((a, b) => {
                    const idA = parseInt(a.sampleId.replace(/\D/g, '')) || 0;
                    const idB = parseInt(b.sampleId.replace(/\D/g, '')) || 0;
                    return idA - idB;
                  })
                  .slice(0, showAll ? visibleData.length : 15)
                  .map((sample: any) => (
                    <TableRow
                      key={sample.sampleId}
                      onClick={() => navigate(`/sample/${sample.sampleId}`)}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <TableCell>{sample.sampleId}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{sample.latitude.toFixed(4)}, {sample.longitude.toFixed(4)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{sample.indices.hpi}</TableCell>
                      <TableCell>{sample.indices.mi}</TableCell>
                      <TableCell>{sample.indices.cd}</TableCell>
                      <TableCell>
                        <Badge variant={getVariant(sample.category)}>{sample.category}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {data.length > 15 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition"
              >
                {showAll ? 'Show Less' : `Show All (${data.length})`}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card id='pollution-chart' className="shadow-elevated dark:bg-gray-900 dark:text-gray-100">
          <CardHeader>
            <CardTitle className="scientific-heading flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Pollution Indices Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="HPI" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MI" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cd" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        <Card id='pie-chart' className="shadow-elevated dark:bg-gray-900 dark:text-gray-100">
          <CardHeader>
            <CardTitle className="scientific-heading flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Contamination Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <Card id='map-visual' className="shadow-elevated dark:bg-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="scientific-heading flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Geospatial Visualization</span>
          </CardTitle>
          <CardDescription>Interactive map showing contamination levels by location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gradient-data rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold scientific-heading mb-2">Interactive Map</h3>
              <p className="text-muted-foreground mb-4">
                Map visualization will display sample locations with color-coded contamination levels
              </p>
              <Button variant="official">Load Map Visualization</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="shadow-elevated dark:bg-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="scientific-heading flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Results</span>
          </CardTitle>
          <CardDescription>Download your analysis results in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="official" onClick={handleDownloadReport} className="h-auto p-6 dark:bg-blue-900 dark:text-white">
              <div className="text-center">
                <Download className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">PDF Report</h3>
                <p className="text-sm opacity-90">Comprehensive analysis report</p>
              </div>
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="h-auto p-6 dark:bg-gray-800 dark:text-white">
              <div className="text-center">
                <Download className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold">CSV Data</h3>
                <p className="text-sm text-muted-foreground">Raw data with calculated indices</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
