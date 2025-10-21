"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import { jobTypes, locations } from "@/config/constants";
import { ROUTES } from "@/config/routes";

const jobSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(200, "Job title is too long"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters").max(5000, "Job description is too long"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  salaryFrom: z.number().min(0, "Minimum salary cannot be negative").max(10000000, "Minimum salary is too high"),
  salaryTo: z.number().min(0, "Maximum salary cannot be negative").max(10000000, "Maximum salary is too high"),
  listingDuration: z.number().min(1, "Duration must be at least 1 day").max(365, "Duration cannot exceed 365 days"),
  status: z.enum(["DRAFT", "ACTIVE"]),
  benefits: z.array(z.string()).optional(),
}).refine((data) => data.salaryTo >= data.salaryFrom, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["salaryTo"],
});

type JobFormData = z.infer<typeof jobSchema>;

export default function JobPostingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [currentBenefit, setCurrentBenefit] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: "ACTIVE",
      listingDuration: 30,
    },
  });

  const addBenefit = () => {
    if (currentBenefit.trim() && !benefits.includes(currentBenefit.trim())) {
      const newBenefits = [...benefits, currentBenefit.trim()];
      setBenefits(newBenefits);
      setValue("benefits", newBenefits);
      setCurrentBenefit("");
    }
  };

  const removeBenefit = (benefit: string) => {
    const newBenefits = benefits.filter((b) => b !== benefit);
    setBenefits(newBenefits);
    setValue("benefits", newBenefits);
  };

  const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          benefits,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.details) {
          const errorMessages = result.details
            .map((issue: { path: string[]; message: string }) => issue.message)
            .join(", ");
          throw new Error(errorMessages);
        }

        throw new Error(result.error || "Failed to post job. Please try again.");
      }

      toast({
        title: "Success!",
        description: result.message || "Job posted successfully",
      });

      router.push(ROUTES.MY_JOBS);
    } catch (error) {
      console.error("Job posting error:", error);

      let errorMessage = "Failed to post job. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              {...register("jobTitle")}
              placeholder="e.g., Senior Software Engineer"
              className={errors.jobTitle ? "border-destructive" : ""}
            />
            {errors.jobTitle && (
              <p className="text-sm text-destructive">{errors.jobTitle.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description *</Label>
            <textarea
              id="jobDescription"
              {...register("jobDescription")}
              rows={6}
              className={`flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.jobDescription ? "border-destructive" : "border-input"
              }`}
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            {errors.jobDescription && (
              <p className="text-sm text-destructive">{errors.jobDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select
              value={watch("location")}
              onValueChange={(value) => setValue("location", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type *</Label>
            <Select
              value={watch("employmentType")}
              onValueChange={(value) => setValue("employmentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employmentType && (
              <p className="text-sm text-destructive">{errors.employmentType.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Salary Range (USD) *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryFrom" className="text-sm text-muted-foreground">
                  Minimum
                </Label>
                <Input
                  id="salaryFrom"
                  type="number"
                  min="0"
                  step="1000"
                  {...register("salaryFrom", { valueAsNumber: true })}
                  placeholder="e.g., 80000"
                  className={errors.salaryFrom ? "border-destructive" : ""}
                />
                {errors.salaryFrom && (
                  <p className="text-sm text-destructive">{errors.salaryFrom.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryTo" className="text-sm text-muted-foreground">
                  Maximum
                </Label>
                <Input
                  id="salaryTo"
                  type="number"
                  min="0"
                  step="1000"
                  {...register("salaryTo", { valueAsNumber: true })}
                  placeholder="e.g., 120000"
                  className={errors.salaryTo ? "border-destructive" : ""}
                />
                {errors.salaryTo && (
                  <p className="text-sm text-destructive">{errors.salaryTo.message}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the annual salary range for this position. Maximum must be greater than or equal to minimum.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="listingDuration">Listing Duration (days) *</Label>
            <Input
              id="listingDuration"
              type="number"
              min="1"
              max="365"
              {...register("listingDuration", { valueAsNumber: true })}
              placeholder="e.g., 30"
              className={errors.listingDuration ? "border-destructive" : ""}
            />
            {errors.listingDuration && (
              <p className="text-sm text-destructive">{errors.listingDuration.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              How many days should this job listing remain active? (1-365 days)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <div className="flex gap-2">
              <Input
                id="benefits"
                value={currentBenefit}
                onChange={(e) => setCurrentBenefit(e.target.value)}
                placeholder="Add a benefit"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBenefit();
                  }
                }}
              />
              <Button type="button" onClick={addBenefit} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="flex items-center gap-1">
                    {benefit}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeBenefit(benefit)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("status", "DRAFT");
            handleSubmit(onSubmit)();
          }}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>

        <Button
          type="submit"
          onClick={() => setValue("status", "ACTIVE")}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
}
