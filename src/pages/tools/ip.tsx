import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Copy, RefreshCw } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function IPPage() {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIP = () => {
    setLoading(true);
    setError(null);
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setIpAddress(data.ip);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching IP:', error);
        setError('Failed to fetch IP address');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIP();
  }, []);

  const copyToClipboard = () => {
    if (!ipAddress) return;

    navigator.clipboard.writeText(ipAddress).then(() => {
      toast.success('IP address copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy IP address');
    });
  };

  return (
    <Layout title="IP Address Tool">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-center">IP Address Tool</h1>
          </div>
          <p className="text-muted-foreground text-center">Get your public IP address</p>
        </div>

        <Card className="w-full max-w-[600px] mx-auto">
          <CardHeader>
            <CardTitle>Your Public IP Address</CardTitle>
            <CardDescription>
              This is your current public IPv4 address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchIP} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                  <p className="text-4xl font-mono font-bold text-primary">
                    {ipAddress}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    className="flex-1 gap-2"
                    variant="outline"
                  >
                    <Copy className="w-4 h-4" />
                    Copy IP Address
                  </Button>
                  <Button
                    onClick={fetchIP}
                    variant="outline"
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>ℹ️ This tool uses the ipify API to fetch your public IP address.</p>
                  <p>💡 Your IP address can be used to identify your approximate location and internet service provider.</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
