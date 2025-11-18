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
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { jobTypes, locations } from "@/config/constants";
import { getDynamicRoute } from "@/config/routes";

// Job validation schema 
const jobSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(200, "Job title is too long"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters").max(5000, "Job description is too long"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  salaryFrom: z.number().min(0, "Minimum salary cannot be negative").max(10000000, "Minimum salary is too high"),
  salaryTo: z.number().min(0, "Maximum salary cannot be negative").max(10000000, "Maximum salary is too high"),
  status: z.enum(["DRAFT", "ACTIVE"]),
  benefits: z.array(z.string()).optional(),
}).refine((data) => data.salaryTo >= data.salaryFrom, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["salaryTo"],
});

type JobFormData = z.infer<typeof jobSchema>;

interface EditJobFormProps {
  job: {
    id: string;
    jobTitle: string;
    jobDescription: string;
    location: string;
    employmentType: string;
    salaryFrom: number;
    salaryTo: number;
    benefits?: string[];
    status: "DRAFT" | "ACTIVE" | "EXPIRED";
  };
}

export function EditJobForm({ job }: EditJobFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      location: job.location,
      employmentType: job.employmentType,
      salaryFrom: job.salaryFrom,
      salaryTo: job.salaryTo,
      benefits: job.benefits || [],
      status: (job.status === "ACTIVE" || job.status === "DRAFT") ? job.status : "DRAFT",
    },
  });

  const benefits = watch("benefits") || [];

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setValue("benefits", [...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setValue("benefits", benefits.filter((b) => b !== benefit));
  };

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.details) {
          const errorMessages = result.details
            .map((issue: { path: string[]; message: string }) => issue.message)
            .join(", ");
          throw new Error(errorMessages);
        }

        throw new Error(result.error || "Failed to update job. Please try again.");
      }

      toast({
        title: "Success!",
        description: result.message || "Job updated successfully.",
      });

      router.push(getDynamicRoute.job(job.id));
    } catch (error) {
      console.error("Error updating job:", error);

      let errorMessage = "Failed to update job. Please try again.";

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
      <Link
        href={getDynamicRoute.job(job.id)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Job
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              {...register("jobTitle")}
              placeholder="e.g. Senior Software Engineer"
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
              placeholder="Describe the role, responsibilities, and requirements..."
              className={`min-h-[200px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.jobDescription ? "border-destructive" : "border-input"
              }`}
            />
            {errors.jobDescription && (
              <p className="text-sm text-destructive">{errors.jobDescription.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {jobTypes.map((type: { id: number; value: string; label: string }) => (
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
                  placeholder="50000"
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
                  placeholder="80000"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits & Perks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a benefit (e.g., Health Insurance)"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => {
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
            <div className="flex flex-wrap gap-2">
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
          {isSubmitting ? "Updating..." : "Update Job"}
        </Button>
      </div>
    </form>
  );
}