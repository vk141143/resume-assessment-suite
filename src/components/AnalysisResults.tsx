
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { ResumeFile } from '@/pages/Index';

interface AnalysisResultsProps {
  resumes: ResumeFile[];
}

export const AnalysisResults = ({ resumes }: AnalysisResultsProps) => {
  const analyzedResumes = resumes.filter(r => r.analysis);
  const matchedResumes = analyzedResumes.filter(r => r.analysis?.passed);
  const rejectedResumes = analyzedResumes.filter(r => r.analysis && !r.analysis.passed);

  if (analyzedResumes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No analysis results available yet.</p>
            <p className="text-sm">Upload resumes and run analysis to see detailed results.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ScoreDisplay = ({ label, score, details }: { label: string; score: number; details: string | string[] }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-600">{score}%</span>
      </div>
      <Progress value={score} className="h-2" />
      <div className="text-xs text-gray-500">
        {Array.isArray(details) ? (
          <ul className="list-disc list-inside">
            {details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        ) : (
          <p>{details}</p>
        )}
      </div>
    </div>
  );

  const ResumeCard = ({ resume }: { resume: ResumeFile }) => {
    if (!resume.analysis) return null;

    const { analysis } = resume;
    
    return (
      <Card className={`border-l-4 ${analysis.passed ? 'border-l-green-500' : 'border-l-red-500'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {analysis.passed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="truncate">{resume.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={analysis.passed ? "default" : "destructive"}>
                {analysis.overallScore}%
              </Badge>
              {analysis.passed ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreDisplay 
              label="Skill Match" 
              score={analysis.skillMatch.score} 
              details={analysis.skillMatch.details}
            />
            <ScoreDisplay 
              label="Experience" 
              score={analysis.experience.score} 
              details={analysis.experience.details}
            />
            <ScoreDisplay 
              label="Education" 
              score={analysis.education.score} 
              details={analysis.education.details}
            />
            <ScoreDisplay 
              label="Projects" 
              score={analysis.projects.score} 
              details={analysis.projects.details}
            />
            <ScoreDisplay 
              label="Certifications" 
              score={analysis.certifications.score} 
              details={analysis.certifications.details}
            />
            <ScoreDisplay 
              label="Location" 
              score={analysis.location.score} 
              details={analysis.location.details}
            />
            <ScoreDisplay 
              label="Communication" 
              score={analysis.communication.score} 
              details={analysis.communication.details}
            />
            <ScoreDisplay 
              label="ATS Score" 
              score={analysis.atsScore.score} 
              details={analysis.atsScore.details}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All Results ({analyzedResumes.length})
            </TabsTrigger>
            <TabsTrigger value="matched" className="text-green-700">
              Matched ({matchedResumes.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-red-700">
              Rejected ({rejectedResumes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {analyzedResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </TabsContent>

          <TabsContent value="matched" className="space-y-4">
            {matchedResumes.length > 0 ? (
              matchedResumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No matched resumes yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedResumes.length > 0 ? (
              rejectedResumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No rejected resumes yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
