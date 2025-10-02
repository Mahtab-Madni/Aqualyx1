import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DataUpload from '@/components/DataUpload';
import Results from '@/components/Results';
import './chatbot.css';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleDataUpload = (data: any[]) => {
    setUploadedData(data);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return (
          <>
            <DataUpload onDataUpload={handleDataUpload} onSectionChange={setActiveSection}/>
            <div className= "chatbot-container">
              <button onClick={() => setIsOpen(!isOpen)} className="chatbot-button">
                {isOpen ? '✖' : '💬'}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width = "100%"
                    height="100%"
                    style = {{minHeight: '650px'}}
                    ></iframe>
                </div>)}
            </div>
          </>
        );
      case 'results':
        return (
          <>
            <Results data={uploadedData} />
            <div className= "chatbot-container">
                <button onClick={() => setIsOpen(!isOpen)} className="chatbot-button">
                  {isOpen ? '✖' : '💬'}
                </button>
                {isOpen && (
                  <div className="chatbot-iframe">
                    <iframe src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                      width = "100%"
                      height="100%"
                      style = {{minHeight: '650px'}}
                      ></iframe>
                  </div>)}
              </div>
          </>
        );
      case 'reports':
        return (
          <>
            <Results data={uploadedData} />
            <div className="chatbot-container">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-button"
              >
                {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width="100%"
                    height="100%"
                    style = {{minHeight: '650px'}}
                  ></iframe>
                </div>
              )}
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-lg shadow-card p-8">
                <h1 className="text-3xl font-bold scientific-heading mb-6">
                  Contact Information
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Ministry of Jal Shakti
                    </h3>
                    <p className="government-text mb-2">
                      Department of Water Resources
                    </p>
                    <p className="government-text mb-2">Government of India</p>
                    <p className="government-text mb-2">New Delhi - 110001</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Technical Support
                    </h3>
                    <p className="government-text mb-2">
                      Email: support@aqualyx.gov.in
                    </p>
                    <p className="government-text mb-2">Phone: 1800-XXX-XXXX</p>
                    <p className="government-text">
                      Hours: 9:00 AM - 6:00 PM (Mon-Fri)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="chatbot-container">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-button"
              >
                {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width="100%"
                    height="100%"
                    style = {{minHeight: '650px'}}
                  ></iframe>
                </div>
              )}
            </div>
          </>
        );
      default:
        return (
          <>
            <Dashboard onSectionChange={setActiveSection} />;
            <div className="chatbot-container">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-button"
              >
                {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width="100%"
                    height="100%"
                    style = {{minHeight: '650px'}}
                  ></iframe>
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
