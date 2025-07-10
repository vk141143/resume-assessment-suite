
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, FileText } from 'lucide-react';
import { JobRequirement } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface JobRequirementsProps {
  onRequirementsSet: (requirements: JobRequirement) => void;
  requirements: JobRequirement | null;
}

export const JobRequirements = ({ onRequirementsSet, requirements }: JobRequirementsProps) => {
  const [skills, setSkills] = useState<string[]>(requirements?.skills || []);
  const [currentSkill, setCurrentSkill] = useState('');
  const [experience, setExperience] = useState(requirements?.experience || '');
  const [education, setEducation] = useState(requirements?.education || '');
  const [certifications, setCertifications] = useState<string[]>(requirements?.certifications || []);
  const [currentCertification, setCurrentCertification] = useState('');
  const [location, setLocation] = useState(requirements?.location || '');
  const [workType, setWorkType] = useState(requirements?.workType || '');
  
  const { toast } = useToast();

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addCertification = () => {
    if (currentCertification.trim() && !certifications.includes(currentCertification.trim())) {
      setCertifications([...certifications, currentCertification.trim()]);
      setCurrentCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setCertifications(certifications.filter(cert => cert !== certToRemove));
  };

  const handleSave = () => {
    if (skills.length === 0 || !experience || !education) {
      toast({
        title: "Incomplete requirements",
        description: "Please fill in all required fields (skills, experience, and education).",
        variant: "destructive"
      });
      return;
    }

    const jobReq: JobRequirement = {
      skills,
      experience,
      education,
      certifications,
      location,
      workType
    };

    onRequirementsSet(jobReq);
    toast({
      title: "Requirements saved",
      description: "Job requirements have been set successfully."
    });
  };

  const loadTemplate = (template: string) => {
    switch (template) {
      case 'frontend':
        setSkills(['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Git']);
        setExperience('2-5 years');
        setEducation('Bachelor\'s degree in Computer Science or related field');
        setCertifications(['AWS Certified Developer']);
        setLocation('Any');
        setWorkType('Remote/Hybrid');
        break;
      case 'backend':
        setSkills(['Python', 'Node.js', 'SQL', 'REST APIs', 'Docker', 'Git']);
        setExperience('3-6 years');
        setEducation('Bachelor\'s degree in Computer Science or related field');
        setCertifications(['AWS Certified Solutions Architect']);
        setLocation('Any');
        setWorkType('Remote/On-site');
        break;
      case 'fullstack':
        setSkills(['React', 'Node.js', 'Python', 'SQL', 'AWS', 'Git', 'JavaScript', 'TypeScript']);
        setExperience('4-7 years');
        setEducation('Bachelor\'s degree in Computer Science or related field');
        setCertifications(['AWS Certified Developer', 'Google Cloud Certified']);
        setLocation('Any');
        setWorkType('Remote/Hybrid');
        break;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Templates */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => loadTemplate('frontend')}>
                Frontend Developer
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadTemplate('backend')}>
                Backend Developer
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadTemplate('fullstack')}>
                Full Stack Developer
              </Button>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Required Skills *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Python, React, AWS..."
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-medium">Experience Level *</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1 years">Entry Level (0-1 years)</SelectItem>
                <SelectItem value="1-3 years">Junior (1-3 years)</SelectItem>
                <SelectItem value="3-5 years">Mid-level (3-5 years)</SelectItem>
                <SelectItem value="5-8 years">Senior (5-8 years)</SelectItem>
                <SelectItem value="8+ years">Lead/Principal (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education" className="text-sm font-medium">Education Requirements *</Label>
            <Textarea
              id="education"
              placeholder="e.g., Bachelor's degree in Computer Science, Engineering, or related field"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              rows={2}
            />
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preferred Certifications</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., AWS Certified, Google Cloud..."
                value={currentCertification}
                onChange={(e) => setCurrentCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCertification()}
              />
              <Button onClick={addCertification} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="flex items-center gap-1">
                  {cert}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeCertification(cert)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location</Label>
            <Input
              id="location"
              placeholder="e.g., New York, Remote, Any"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Work Type */}
          <div className="space-y-2">
            <Label htmlFor="workType" className="text-sm font-medium">Work Type</Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger>
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Remote/Hybrid">Remote/Hybrid</SelectItem>
                <SelectItem value="Any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} size="lg" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Requirements
          </Button>
        </CardContent>
      </Card>

      {requirements && (
        <Card>
          <CardHeader>
            <CardTitle>Current Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Skills</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {requirements.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Experience</Label>
              <p className="text-sm">{requirements.experience}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Education</Label>
              <p className="text-sm">{requirements.education}</p>
            </div>
            {requirements.certifications.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Certifications</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {requirements.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
