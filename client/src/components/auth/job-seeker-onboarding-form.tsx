"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface JobSeekerOnboardingFormProps {
  onComplete: (jobSeekerData: JobSeekerFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface JobSeekerFormData {
  name: string;
  about: string;
}

const JobSeekerOnboardingForm = ({ onComplete, isLoading = false }: JobSeekerOnboardingFormProps) => {
  const [formData, setFormData] = useState<JobSeekerFormData>({
    name: "",
    about: "",
  });
  const [errors, setErrors] = useState<Partial<JobSeekerFormData>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<JobSeekerFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.about.trim()) {
      newErrors.about = "About section is required";
    } else if (formData.about.trim().length < 50) {
      newErrors.about = "About section must be at least 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      await onComplete(formData);
    } catch (error) {
      console.error("Job seeker onboarding error:", error);
      toast({
        title: "Setup Error",
        description: "Failed to set up your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof JobSeekerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Set Up Your Profile</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about yourself to find the perfect job opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="about">About You *</Label>
          <textarea
            id="about"
            value={formData.about}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("about", e.target.value)}
            placeholder="Tell us about your experience, skills, career goals, and what makes you unique as a candidate."
            rows={5}
            disabled={isLoading}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            {formData.about.length}/50 characters minimum
          </p>
          {errors.about && (
            <p className="text-sm text-destructive">{errors.about}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Setting up your profile..." : "Complete Profile Setup"}
        </Button>
      </form>

      <div className="text-xs text-muted-foreground text-balance text-center">
        You can update your profile information anytime from your dashboard.
      </div>
    </div>
  );
};

export default JobSeekerOnboardingForm;
