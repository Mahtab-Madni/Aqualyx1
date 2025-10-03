
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataUploadProps {
  onDataUpload: (data: any[]) => void;
  onSectionChange: (section: string) => void;
}

const DataUpload = ({ onDataUpload, onSectionChange }: DataUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidData, setIsValidData] = useState(false);
  const { toast } = useToast();

  const requiredColumns = [
    'Location', 'Latitude', 'Longitude', 'F (mg/L)', 'pH', 
    'NO3 (mg/L)', 'As (ppb)', 'U (ppb)', 'Fe (ppm)','EC (µS/cm at 25 °C)','Total Hardness (mg/L)'
  ];

  const sampleData = [
    {
      Sample_ID: 'GW001',
      Latitude: 28.6139,
      Longitude: 77.2090,
      Lead: 0.05,
      Cadmium: 0.002,
      Arsenic: 0.008,
      Chromium: 0.025,
      Mercury: 0.001,
      Copper: 0.15
    },
    {
      Sample_ID: 'GW002', 
      Latitude: 28.6200,
      Longitude: 77.2150,
      Lead: 0.12,
      Cadmium: 0.008,
      Arsenic: 0.015,
      Chromium: 0.045,
      Mercury: 0.003,
      Copper: 0.28
    },
    {
      Sample_ID: 'GW003',
      Latitude: 28.6180,
      Longitude: 77.2120,
      Lead: 0.08,
      Cadmium: 0.005,
      Arsenic: 0.012,
      Chromium: 0.032,
      Mercury: 0.002,
      Copper: 0.19
    },
    {
      Sample_ID: 'GW004',
      Latitude: 28.6180,
      Longitude: 77.2120,
      Lead: 0.08,
      Cadmium: 0.005,
      Arsenic: 0.012,
      Chromium: 0.032,
      Mercury: 0.002,
      Copper: 0.19
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    validateFile(file);
  };

  const validateFile = (file: File) => {
    // Simulated validation for prototype
    const errors: string[] = [];
    
    // Simulate random validation scenarios
    const hasAllColumns = Math.random() > 0.2; // 80% chance of having all columns
    const hasValidData = Math.random() > 0.1; // 90% chance of valid data
    
    if (!hasAllColumns) {
      errors.push('Missing required columns in the uploaded file.');
    }
    
    if (!hasValidData) {
      errors.push('Data format is invalid.');
    }

    setValidationErrors(errors);
    setIsValidData(errors.length === 0);

    if (errors.length === 0) {
      toast({
        title: "File validated successfully",
        description: "Data is ready for analysis",
        variant: "default",
      });
    }
  };

  // const handleUseSampleData = () => {
  //   setUploadedFile(null);
  //   setValidationErrors([]);
  //   setIsValidData(true);
  //   onDataUpload(sampleData);
    
  //   toast({
  //     title: "Sample data loaded",
  //     description: "Ready to proceed with analysis",
  //     variant: "default",
  //   });
  // };

  // const handleProceedToAnalysis = () => {
  //   if (isValidData) {
  //     onDataUpload(sampleData); // Use sample data for prototype
  //     onSectionChange('results');
  //   }
  // };
  const handleProceedToAnalysis = async () => {
    if (!isValidData || !uploadedFile) return;
    const formData = new FormData();
    formData.append("file", uploadedFile); // 'file' must match backend field name
  
    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData, // No need to set Content-Type manually
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast({
          title: "Upload successful",
          description: `${result.count} samples processed`,
          variant: "default",
        });
        onSectionChange("results");
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Server error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Could not reach the server",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    }
};

  return (
    <div className="animate-fade-in bg-gray-100 text-gray-900 min-h-screen py-10 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold scientific-heading mb-2">
            Upload Groundwater Data
          </h1>
          <p className="text-lg text-muted-foreground">
            Import your sample dataset and validate before analysis.
          </p>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Upload & Validation */}
          <div className="md:col-span-2">
            <Card className="shadow-elevated bg-white text-gray-900">
              <CardHeader>
                <CardTitle className="scientific-heading text-2xl flex items-center space-x-2">
                  <Upload className="h-6 w-6" />
                  <span>Data Upload</span>
                </CardTitle>
                <CardDescription>
                  Upload your groundwater sample data in CSV or Excel format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-primary bg-primary/5 shadow-data dark:bg-blue-900/10'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-blue-900/10'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-data rounded-full dark:bg-gradient-to-br dark:from-blue-900 dark:to-gray-800">
                      <Upload className="h-8 w-8 text-primary dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Drop your files here</p>
                      <p className="text-muted-foreground">or click to browse</p>
                    </div>
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline" className="dark:bg-gray-800 dark:text-gray-200">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                </div>

                {/* Sample Data Option */}
                {/* <div className="text-center">
                  <p className="text-muted-foreground mb-4 dark:text-gray-400">Or try with sample data</p>
                  <Button variant="official" onClick={handleUseSampleData} className="dark:bg-blue-900 dark:text-white">
                    Use Sample Dataset
                  </Button>
                </div> */}

                {/* Uploaded File Info */}
                {uploadedFile && (
                  <Card className="shadow-data dark:bg-gray-900 dark:text-gray-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{uploadedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUploadedFile(null);
                            setValidationErrors([]);
                            setIsValidData(false);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Validation Results */}
                {(uploadedFile || isValidData) && (
                  <div className="space-y-3">
                    {validationErrors.length > 0 ? (
                      <Alert variant="destructive" className="dark:bg-red-950 dark:text-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="font-medium">Validation Errors:</p>
                            {validationErrors.map((error, index) => (
                              <p key={index}>• {error}</p>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-safe bg-safe/10 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="h-4 w-4 text-safe" />
                        <AlertDescription className="text-safe-foreground">
                          Data validation successful! Ready to proceed with analysis.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Proceed Button */}
                {isValidData && (
                  <div className="text-center">
                    <Button
                      variant="tricolor"
                      size="lg"
                      onClick={handleProceedToAnalysis}
                      className="text-lg px-8 bg-blue-900 text-white border-none hover:brightness-110 dark:from-blue-700 dark:via-green-600 dark:to-yellow-400"
                    >
                      Proceed to Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Right: Required Format Info */}
          <div>
            <Card className="shadow-data bg-white text-gray-900">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-wide dark:text-white">
                  🧾 Required Data Format
                </CardTitle>
                <CardDescription className="dark:text-gray-400 text-base">
                  Your dataset must include the following columns:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {requiredColumns.map((column) => (
                    <div
                      key={column}
                      className="px-3 py-2 rounded-lg text-sm font-semibold 
                        bg-gradient-to-r from-blue-100 to-blue-50 
                        dark:from-blue-900/30 dark:to-gray-800 
                        border border-blue-200 dark:border-blue-700
                        shadow-sm hover:shadow-md transition-all duration-200 
                        text-center"
                    >
                      {column}
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-5 rounded-xl border border-dashed border-yellow-400
                  bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-sm leading-relaxed dark:text-yellow-200">
                    <strong className="font-semibold">Note:</strong>  
                    • Metal concentrations → <span className="font-mono">mg/L</span>  
                    • Latitude & Longitude → decimal degrees
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
