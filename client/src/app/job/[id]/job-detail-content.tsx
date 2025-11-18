import { getJobById as getJobByIdClient } from "@/lib/database/firestore";
import { getJobById as getJobByIdServer, isAdminSdkAvailable } from "@/lib/database/firestore-server";
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
import type { Session } from "next-auth";

interface JobDetailContentProps {
  id: string;
  session: Session | null;
}

export async function JobDetailContent({ id, session }: JobDetailContentProps) {
  const job = isAdminSdkAvailable
    ? await getJobByIdServer(id)
    : await getJobByIdClient(id);

  if (!job) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The job you're looking for doesn't exist.
          </p>
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
              <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
              <div className="flex items-center gap-2 mt-3">
                <p className="font-medium">{job.company?.name}</p>
                <span className="hidden md:inline text-muted-foreground">•</span>
                <Badge className="rounded-full" variant="secondary">
                  {jobTypes.find(
                    (jobType) => jobType.value === job.employmentType
                  )?.label || job.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">•</span>
                <Badge className="rounded-full text-white">
                  {locationFlag && <span className="mr-1">{locationFlag}</span>}
                  {job.location}
                </Badge>
              </div>
            </div>

            {(!session || session.user.userType === "JOB_SEEKER") && (
              session ? (
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
              )
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Job Description</h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: job.jobDescription }} />

              {job.benefits && job.benefits.length > 0 && (
                <>
                  <h3>Benefits:</h3>
                  <ul>
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {(!session || session.user.userType === "JOB_SEEKER") && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session ? (
                  <Button className="w-full">
                    Apply Now
                  </Button>
                ) : (
                  <Link href={`/login?redirect=/job/${id}`} className="w-full">
                    <Button className="w-full">
                      Sign in to Apply
                    </Button>
                  </Link>
                )}
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(job.salaryFrom, job.salaryTo)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Posted <FormattedDate date={job.createdAt} /></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {session?.user.userType === "COMPANY" && session.user.companyId === job.companyId && (
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
                <Button className="w-full" variant="outline">
                  View Applications
                </Button>
                <Button className="w-full" variant="destructive">
                  Remove Job
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(job.salaryFrom, job.salaryTo)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Posted <FormattedDate date={job.createdAt} /></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {(!session || session.user.userType === "JOB_SEEKER") && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">About the Company</CardTitle>
              </CardHeader>
              <CardContent>
                {job.company && (
                  <div className="flex items-start gap-4">
                    {job.company.logo ? (
                      <Image
                        src={job.company.logo}
                        alt={`${job.company.name} logo`}
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
                      <h3 className="font-semibold">{job.company.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.company.about}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.company.location}</span>
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
