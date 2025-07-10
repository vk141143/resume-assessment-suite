
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ResumeUpload } from '@/components/ResumeUpload';
import { JobRequirements } from '@/components/JobRequirements';
import { AnalysisResults } from '@/components/AnalysisResults';
import { useToast } from '@/hooks/use-toast';

export interface ResumeFile {
  id: string;
  file: File;
  name: string;
  status: 'pending' | 'analyzing' | 'matched' | 'rejected';
  analysis?: ResumeAnalysis;
}

export interface ResumeAnalysis {
  skillMatch: { score: number; details: string[] };
  experience: { score: number; details: string };
  education: { score: number; details: string };
  projects: { score: number; details: string[] };
  certifications: { score: number; details: string[] };
  location: { score: number; details: string };
  communication: { score: number; details: string };
  atsScore: { score: number; details: string };
  overallScore: number;
  passed: boolean;
}

export interface JobRequirement {
  skills: string[];
  experience: string;
  education: string;
  certifications: string[];
  location: string;
  workType: string;
}

const Index = () => {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [jobRequirements, setJobRequirements] = useState<JobRequirement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    if (resumes.length + files.length > 10) {
      toast({
        title: "Upload limit exceeded",
        description: "You can only upload up to 10 resumes at once.",
        variant: "destructive"
      });
      return;
    }

    const newResumes: ResumeFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      status: 'pending'
    }));

    setResumes(prev => [...prev, ...newResumes]);
    toast({
      title: "Files uploaded successfully",
      description: `${files.length} resume(s) ready for analysis.`
    });
  };

  const analyzeResume = (resume: File): Promise<ResumeAnalysis> => {
    return new Promise((resolve) => {
      // Simulate resume analysis with realistic scoring
      setTimeout(() => {
        const skillMatch = {
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          details: ['Python: Found', 'React: Found', 'AWS: Missing', 'Teamwork: Found']
        };
        
        const experience = {
          score: Math.floor(Math.random() * 30) + 70, // 70-100
          details: `${Math.floor(Math.random() * 3) + 2}-${Math.floor(Math.random() * 3) + 5} years experience found`
        };

        const education = {
          score: Math.floor(Math.random() * 25) + 75, // 75-100
          details: 'Bachelor\'s degree in Computer Science found'
        };

        const projects = {
          score: Math.floor(Math.random() * 35) + 65, // 65-100
          details: ['E-commerce platform development', 'Healthcare management system']
        };

        const certifications = {
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          details: ['AWS Certified', 'Google Cloud missing']
        };

        const location = {
          score: Math.floor(Math.random() * 20) + 80, // 80-100
          details: 'Open to remote work'
        };

        const communication = {
          score: Math.floor(Math.random() * 15) + 85, // 85-100
          details: 'Professional writing, good grammar'
        };

        const atsScore = {
          score: Math.floor(Math.random() * 30) + 70, // 70-100
          details: 'ATS-friendly format with good keyword density'
        };

        const overallScore = Math.round(
          (skillMatch.score * 0.25 + 
           experience.score * 0.20 + 
           education.score * 0.15 + 
           projects.score * 0.15 + 
           certifications.score * 0.10 + 
           location.score * 0.05 + 
           communication.score * 0.05 + 
           atsScore.score * 0.05)
        );

        const passed = overallScore >= 75; // Threshold for matching

        resolve({
          skillMatch,
          experience,
          education,
          projects,
          certifications,
          location,
          communication,
          atsScore,
          overallScore,
          passed
        });
      }, 2000 + Math.random() * 1000); // 2-3 seconds per resume
    });
  };

  const handleAnalyzeAll = async () => {
    if (!jobRequirements) {
      toast({
        title: "Job requirements missing",
        description: "Please set job requirements before analyzing resumes.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const totalResumes = resumes.length;
    let completedCount = 0;

    for (let i = 0; i < resumes.length; i++) {
      const resume = resumes[i];
      
      setResumes(prev => prev.map(r => 
        r.id === resume.id ? { ...r, status: 'analyzing' } : r
      ));

      const analysis = await analyzeResume(resume.file);
      
      setResumes(prev => prev.map(r => 
        r.id === resume.id 
          ? { 
              ...r, 
              status: analysis.passed ? 'matched' : 'rejected',
              analysis 
            } 
          : r
      ));

      completedCount++;
      setAnalysisProgress((completedCount / totalResumes) * 100);
    }

    setIsAnalyzing(false);
    toast({
      title: "Analysis completed",
      description: `${resumes.filter(r => r.analysis?.passed).length} resumes matched the requirements.`
    });
  };

  const generateExcel = (type: 'matched' | 'rejected') => {
    const filteredResumes = resumes.filter(r => 
      type === 'matched' ? r.analysis?.passed : r.analysis && !r.analysis.passed
    );

    if (filteredResumes.length === 0) {
      toast({
        title: "No data to export",
        description: `No ${type} resumes found.`,
        variant: "destructive"
      });
      return;
    }

    // Simulate Excel generation
    const csvContent = [
      ['Name', 'Overall Score', 'Skill Match', 'Experience', 'Education', 'Projects', 'Certifications', 'Location', 'Communication', 'ATS Score', 'Status'].join(','),
      ...filteredResumes.map(resume => [
        resume.name,
        resume.analysis?.overallScore || 0,
        resume.analysis?.skillMatch.score || 0,
        resume.analysis?.experience.score || 0,
        resume.analysis?.education.score || 0,
        resume.analysis?.projects.score || 0,
        resume.analysis?.certifications.score || 0,
        resume.analysis?.location.score || 0,
        resume.analysis?.communication.score || 0,
        resume.analysis?.atsScore.score || 0,
        type
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_resumes.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Excel file generated",
      description: `${type} resumes exported successfully.`
    });
  };

  const matchedCount = resumes.filter(r => r.analysis?.passed).length;
  const rejectedCount = resumes.filter(r => r.analysis && !r.analysis.passed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Resume Analysis System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload up to 10 resumes and analyze them against job requirements with our comprehensive 8-aspect scoring system.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Requirements
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <ResumeUpload 
              onFileUpload={handleFileUpload}
              uploadedFiles={resumes}
              maxFiles={10}
            />
          </TabsContent>

          <TabsContent value="requirements">
            <JobRequirements 
              onRequirementsSet={setJobRequirements}
              requirements={jobRequirements}
            />
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Resume Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No resumes uploaded yet. Please upload resumes first.
                  </div>
                ) : !jobRequirements ? (
                  <div className="text-center py-8 text-gray-500">
                    Please set job requirements before starting analysis.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {resumes.length} resume(s) ready for analysis
                        </p>
                        {isAnalyzing && (
                          <Progress value={analysisProgress} className="w-64" />
                        )}
                      </div>
                      <Button 
                        onClick={handleAnalyzeAll}
                        disabled={isAnalyzing}
                        size="lg"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {resumes.map((resume) => (
                        <div key={resume.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">{resume.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {resume.status === 'pending' && (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                            {resume.status === 'analyzing' && (
                              <Badge variant="outline">Analyzing...</Badge>
                            )}
                            {resume.status === 'matched' && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Matched
                              </Badge>
                            )}
                            {resume.status === 'rejected' && (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Rejected
                              </Badge>
                            )}
                            {resume.analysis && (
                              <span className="text-sm text-gray-500">
                                Score: {resume.analysis.overallScore}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold text-green-600">{matchedCount}</p>
                        <p className="text-sm text-gray-600">Matched Resumes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                        <p className="text-sm text-gray-600">Rejected Resumes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{resumes.length}</p>
                        <p className="text-sm text-gray-600">Total Resumes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Export Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={() => generateExcel('matched')}
                      disabled={matchedCount === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Matched Resumes ({matchedCount})
                    </Button>
                    <Button 
                      onClick={() => generateExcel('rejected')}
                      disabled={rejectedCount === 0}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Rejected Resumes ({rejectedCount})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              <AnalysisResults resumes={resumes} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
