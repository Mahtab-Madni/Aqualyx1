import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { MapPin, CalendarDays, FlaskConical } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const SampleReportPage: React.FC = () => {
  const { id } = useParams();
  const [sample, setSample] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('reports');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/samples/${id}`)
      .then(res => setSample(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

  if (!sample) return <p className="text-center py-10 text-muted-foreground">Loading report...</p>;

  const waterData = Object.entries(sample.waterQuality).map(([key, value]) => ({ name: key, value }));
  const metalData = Object.entries(sample.metals).map(([key, value]) => ({ name: key, value }));
  const indexData = Object.entries(sample.indices).map(([key, value]) => ({ name: key.toUpperCase(), value }));

  const getVariant = (category: string) => {
  switch (category) {
    case 'safe': return 'safe';
    case 'moderate': return 'moderate';
    case 'unsafe': return 'unsafe';
    default: return 'default';
    }
  };

  const handleDownloadSampleReport = async () => {
    try {
      const captureImage = async (id: string) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: '#ffffff',
        });
        return canvas.toDataURL('image/png');
      };
      await new Promise((r) => setTimeout(r, 300)); // wait for charts to render

      const pollutionChart = await captureImage('pollution-chart');
      const pieChart = await captureImage('pie-chart');
      const indexChart = await captureImage('index-chart');

      const response = await axios.post(
        'http://localhost:5000/api/export/sample-pdf',
        {
          sample,
          charts: {
            pollutionChart,
            pieChart,
            indexChart,
          },
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `Sample_Report_${sample.sampleId}.pdf`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  const filteredMetalData = metalData.filter(item => Number(item.value) > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeSection="reports" onSectionChange={setActiveSection} />
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 mb-4 rounded-md bg-muted text-foreground hover:bg-muted/80 transition"
        >
          ← Back to Home
        </button>
      </div>
      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">💧 Detailed Report: {sample.sampleId}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p><MapPin className="inline-block w-4 h-4 mr-1" /> <strong>Location:</strong> {sample.village}, {sample.block}, {sample.district}, {sample.state}</p>
              <p><strong>Coordinates:</strong> {sample.latitude.toFixed(4)}, {sample.longitude.toFixed(4)}</p>
              <p><strong>Status:</strong> <Badge variant={getVariant(sample.category)}>{sample.category}</Badge></p>
              <p><CalendarDays className="inline-block w-4 h-4 mr-1" /> <strong>Sampling Date:</strong> {new Date(sample.samplingDate).toLocaleDateString()}</p>
              <p><FlaskConical className="inline-block w-4 h-4 mr-1" /> <strong>Well Type:</strong> {sample.wellType}</p>
            </div>

            <Separator />

            <div id='pollution-chart' className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-4 rounded-md hover:shadow transition">
                <h4 className="font-semibold text-lg mb-2">🧪 Water Quality Parameters</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={waterData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div id='pie-chart' className="bg-muted/30 p-4 rounded-md hover:shadow transition">
                <h4 className="font-semibold text-lg mb-2">⚠️ Heavy Metals</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={filteredMetalData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {filteredMetalData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div id='index-chart' className="md:col-span-2 bg-muted/30 p-4 rounded-md hover:shadow transition">
                <h4 className="font-semibold text-lg mb-2">📊 Indices</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={indexData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={handleDownloadSampleReport}
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
                >
                  Download PDF Report
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SampleReportPage;
