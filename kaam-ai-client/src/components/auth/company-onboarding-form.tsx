"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isValidUrl, isValidTwitterHandle } from "@/utils/validation";

interface CompanyOnboardingFormProps {
  onComplete: (companyData: CompanyFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface CompanyFormData {
  companyName: string;
  location: string;
  about: string;
  website: string;
  logo?: string;
  xAccount?: string;
}

const CompanyOnboardingForm = ({ onComplete, isLoading }: CompanyOnboardingFormProps) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    location: "",
    about: "",
    website: "",
    xAccount: "",
  });
  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyFormData> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.about.trim()) {
      newErrors.about = "Company description is required";
    } else if (formData.about.trim().length < 50) {
      newErrors.about = "Company description must be at least 50 characters";
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    } else if (!isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }

    if (formData.xAccount && !isValidTwitterHandle(formData.xAccount)) {
      newErrors.xAccount = "Please enter a valid X (Twitter) handle";
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
      const normalizedWebsite = formData.website.startsWith('http')
        ? formData.website
        : `https://${formData.website}`;

      const normalizedXAccount = formData.xAccount
        ? formData.xAccount.startsWith('@')
          ? formData.xAccount
          : `@${formData.xAccount}`
        : undefined;

      await onComplete({
        ...formData,
        website: normalizedWebsite,
        xAccount: normalizedXAccount,
      });
    } catch (error) {
      console.error("Company onboarding error:", error);
      toast({
        title: "Setup Error",
        description: "Failed to set up your company profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
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
        <h2 className="text-2xl font-bold">Set Up Your Company Profile</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your company to start posting jobs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="Enter your company name"
            disabled={isLoading}
          />
          {errors.companyName && (
            <p className="text-sm text-destructive">{errors.companyName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g., San Francisco, CA"
            disabled={isLoading}
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website *</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            placeholder="www.yourcompany.com"
            disabled={isLoading}
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="xAccount">X (Twitter) Handle (Optional)</Label>
          <Input
            id="xAccount"
            value={formData.xAccount}
            onChange={(e) => handleInputChange("xAccount", e.target.value)}
            placeholder="@yourcompany"
            disabled={isLoading}
          />
          {errors.xAccount && (
            <p className="text-sm text-destructive">{errors.xAccount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="about">Company Description *</Label>
          <textarea
            id="about"
            value={formData.about}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("about", e.target.value)}
            placeholder="Tell us about your company, what you do, your mission, culture, etc."
            rows={4}
            disabled={isLoading}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          {isLoading ? "Setting up your company..." : "Complete Company Setup"}
        </Button>
      </form>
    </div>
  );
};

export default CompanyOnboardingForm;
