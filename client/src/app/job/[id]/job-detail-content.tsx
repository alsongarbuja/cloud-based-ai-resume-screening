"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Building2, Calendar, DollarSign, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/format/currency";
import { jobTypes } from "@/config/constants";
import { getFlagEmoji } from "@/utils/countries";
import { FormattedDate } from "@/components/ui/formatted-date";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { redirect } from "next/navigation";

interface JobDetailContentProps {
  id: number;
  token: string;
  user: User | null;
}

export function JobDetailContent({ id, token, user }: JobDetailContentProps) {
  const { data } = useQuery({
    queryKey: ["jobs", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data;
    },
  });
  const job = data;

  const { mutateAsync } = useMutation({
    mutationKey: ["applied"],
    mutationFn: async (data: { jobId: number }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/applied`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const d = await res.json();
      return d;
    },
    onSuccess: () => {
      redirect("/my-applications");
    },
  });

  if (!job) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <p className="text-muted-foreground mt-2">The job you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const locationFlag = getFlagEmoji(job.location);

  return (
    <div className="py-8 pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-8 col-1 md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <div className="flex items-center gap-2 mt-3">
                <p className="font-medium">{job.company?.name}</p>
                <Badge className="rounded-full" variant="secondary">
                  {jobTypes.find((jobType) => jobType.value === job.type)?.label ||
                    job.employmentType}
                </Badge>
                <Badge className="rounded-full text-white" variant="outline">
                  {locationFlag && <span className="mr-1">{locationFlag}</span>}
                  {job.location}
                </Badge>
              </div>
            </div>

            {false ? (
              <Button variant="outline" className="shadow-none">
                <Heart className="size-4" />
                Save Job
              </Button>
            ) : (
              <Link href={`/login?redirect=/job/${id}`}>
                <Button variant="outline" className="shadow-none">
                  <Heart className="size-4" />
                  Save Job
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Job Description</h2>
            <div className="prose max-w-none">
              {job.desc}
              {/* <div dangerouslySetInnerHTML={{ __html: job.desc }} /> */}

              <h3 className="text-lg font-semibold mt-4 mb-2">Responsibilites:</h3>
              <ul className="list-disc pl-8">
                {job.resp.split("\n").map((resp: string, index: number) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mt-4 mb-2">Requirements:</h3>
              <ul className="list-disc pl-8">
                {job.req.split("\n").map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {user && user.type === "user" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* {false ? ( */}
                <Button
                  className="w-full"
                  onClick={async () => {
                    await mutateAsync({
                      jobId: job.id,
                    });
                  }}
                >
                  Apply Now
                </Button>
                {/* ) : (
                  <Link href={`/login?redirect=/job/${id}`} className="w-full">
                    <Button className="w-full">Sign in to Apply</Button>
                  </Link>
                )} */}
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(job.minSalary, job.maxSalary)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Posted <FormattedDate date={new Date(job.createdAt)} />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user && user.type === "org" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Manage this job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/edit-job/${job.id}`} className="w-full">
                  <Button className="w-full" variant="outline">
                    Edit Job
                  </Button>
                </Link>
                <Link href={`/job/${job.id}/applications`} className="w-full">
                  <Button className="w-full my-2" variant="outline">
                    View Applications
                  </Button>
                </Link>
                <Button className="w-full" variant="destructive">
                  Remove Job
                </Button>
              </CardContent>
            </Card>
          )}

          {/* <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(job.minSalary, job.maxSalary)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Posted <FormattedDate date={new Date(job.createdAt)} />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {false && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">About the Company</CardTitle>
              </CardHeader>
              <CardContent>
                {job.createdBy && (
                  <div className="flex items-start gap-4">
                    {job.createdBy.logo ? (
                      <Image
                        src={job.createdBy.logo}
                        alt={`${job.createdBy.name} logo`}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="size-12 bg-muted rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="font-semibold">{job.createdBy.name}</h3>
                      <p className="text-sm text-muted-foreground">{job.createdBy.desc}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.createdBy.address}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
