// This is a one-time script to seed Firebase with sample data
// Run with: npx tsx scripts/seed-firebase.ts

import "./firebase-seed-config";

import { 
  createUser, 
  createCompany, 
  createJob, 
  createJobSeeker 
} from "../src/lib/database/firestore";

const seedData = async () => {
  try {
    console.log("🌱 Starting Firebase seeding...");

    const companies = [
      {
        user: {
          name: "Tech Corp",
          email: "admin@techcorp.com",
          onboardingComplete: true,
          userType: "COMPANY" as const,
        },
        company: {
          name: "Tech Corp",
          location: "United States",
          about: "Leading technology company specializing in AI and machine learning solutions.",
          website: "https://techcorp.com",
          logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=face",
        }
      },
      {
        user: {
          name: "StartupHub",
          email: "jobs@startuphub.com",
          onboardingComplete: true,
          userType: "COMPANY" as const,
        },
        company: {
          name: "StartupHub",
          location: "United Kingdom",
          about: "Dynamic startup accelerator helping businesses scale rapidly.",
          website: "https://startuphub.com",
          logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400&h=400&fit=crop&crop=face",
        }
      },
      {
        user: {
          name: "Global Solutions",
          email: "careers@globalsolutions.com",
          onboardingComplete: true,
          userType: "COMPANY" as const,
        },
        company: {
          name: "Global Solutions",
          location: "Remote",
          about: "International consulting firm providing digital transformation services.",
          website: "https://globalsolutions.com",
          logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop&crop=face",
        }
      }
    ];

    const companyIds: string[] = [];

    for (const companyData of companies) {
      
      const userId = await createUser(companyData.user);
      
      const companyId = await createCompany({
        ...companyData.company,
        userId,
      });
      
      companyIds.push(companyId);
    }

    // Create sample jobs
    const jobs = [
      {
        jobTitle: "Senior Frontend Developer",
        jobDescription: `
          <p>We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building the next generation of web applications using modern technologies.</p>

          <h3>Requirements:</h3>
          <ul>
            <li>5+ years of experience with React.js and TypeScript</li>
            <li>Strong understanding of modern CSS frameworks (Tailwind CSS preferred)</li>
            <li>Experience with state management libraries (Redux, Zustand)</li>
            <li>Knowledge of modern build tools (Vite, Webpack)</li>
            <li>Experience with testing frameworks (Jest, React Testing Library)</li>
          </ul>

          <h3>Nice to have:</h3>
          <ul>
            <li>Experience with Next.js</li>
            <li>Knowledge of GraphQL</li>
            <li>Mobile development experience (React Native)</li>
          </ul>
        `,
        employmentType: "full-time",
        location: "United States",
        salaryFrom: 120000,
        salaryTo: 180000,
        listingDuration: 30,
        benefits: ["Health Insurance", "Dental & Vision", "401k Match", "Flexible PTO", "Remote Work"],
        status: "ACTIVE" as const,
        companyId: companyIds[0],
      },
      {
        jobTitle: "Full Stack Engineer",
        jobDescription: `
          <p>Join our growing startup as a Full Stack Engineer. You'll work on exciting projects that impact millions of users worldwide.</p>

          <h3>What you'll do:</h3>
          <ul>
            <li>Develop and maintain web applications using React and Node.js</li>
            <li>Design and implement RESTful APIs</li>
            <li>Work with databases (PostgreSQL, MongoDB)</li>
            <li>Collaborate with cross-functional teams</li>
            <li>Participate in code reviews and technical discussions</li>
          </ul>

          <h3>Requirements:</h3>
          <ul>
            <li>3+ years of full-stack development experience</li>
            <li>Proficiency in JavaScript/TypeScript</li>
            <li>Experience with React.js and Node.js</li>
            <li>Database design and optimization skills</li>
            <li>Understanding of cloud platforms (AWS, GCP)</li>
          </ul>
        `,
        employmentType: "full-time",
        location: "United Kingdom",
        salaryFrom: 90000,
        salaryTo: 140000,
        listingDuration: 30,
        benefits: ["Equity Package", "Health Insurance", "Learning Budget", "Gym Membership"],
        status: "ACTIVE" as const,
        companyId: companyIds[1],
      },
      {
        jobTitle: "DevOps Engineer",
        jobDescription: `
          <p>We're seeking a DevOps Engineer to help us scale our infrastructure and improve our deployment processes.</p>
          
          <h3>Responsibilities:</h3>
          <ul>
            <li>Manage cloud infrastructure on AWS/Azure</li>
            <li>Implement CI/CD pipelines</li>
            <li>Monitor application performance and reliability</li>
            <li>Automate deployment processes</li>
            <li>Ensure security best practices</li>
          </ul>
          
          <h3>Required Skills:</h3>
          <ul>
            <li>Experience with containerization (Docker, Kubernetes)</li>
            <li>Knowledge of Infrastructure as Code (Terraform, CloudFormation)</li>
            <li>Proficiency in scripting languages (Python, Bash)</li>
            <li>Experience with monitoring tools (Prometheus, Grafana)</li>
            <li>Understanding of networking and security concepts</li>
          </ul>
        `,
        employmentType: "full-time",
        location: "Remote",
        salaryFrom: 110000,
        salaryTo: 160000,
        listingDuration: 30,
        benefits: ["Remote Work", "Health Insurance", "Home Office Stipend", "Conference Budget"],
        status: "ACTIVE" as const,
        companyId: companyIds[2],
      },
      {
        jobTitle: "Product Manager",
        jobDescription: `
          <p>Lead product strategy and execution for our core platform. Work closely with engineering, design, and business teams.</p>

          <h3>What you'll do:</h3>
          <ul>
            <li>Define product roadmap and strategy</li>
            <li>Conduct market research and user analysis</li>
            <li>Work with engineering teams to deliver features</li>
            <li>Analyze product metrics and user feedback</li>
            <li>Collaborate with stakeholders across the organization</li>
          </ul>

          <h3>Requirements:</h3>
          <ul>
            <li>5+ years of product management experience</li>
            <li>Strong analytical and problem-solving skills</li>
            <li>Experience with agile development methodologies</li>
            <li>Excellent communication and leadership skills</li>
            <li>Technical background preferred</li>
          </ul>
        `,
        employmentType: "full-time",
        location: "Canada",
        salaryFrom: 140000,
        salaryTo: 200000,
        listingDuration: 30,
        benefits: ["Equity", "Health Insurance", "Unlimited PTO", "Parental Leave"],
        status: "ACTIVE" as const,
        companyId: companyIds[0],
      },
      {
        jobTitle: "UI/UX Designer",
        jobDescription: `
          <p>Create beautiful and intuitive user experiences for our web and mobile applications.</p>

          <h3>Responsibilities:</h3>
          <ul>
            <li>Design user interfaces for web and mobile applications</li>
            <li>Create wireframes, mockups, and prototypes</li>
            <li>Conduct user research and usability testing</li>
            <li>Collaborate with product and engineering teams</li>
            <li>Maintain design system and style guides</li>
          </ul>

          <h3>Requirements:</h3>
          <ul>
            <li>3+ years of UI/UX design experience</li>
            <li>Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)</li>
            <li>Strong understanding of design principles</li>
            <li>Experience with user research methodologies</li>
            <li>Portfolio showcasing your design work</li>
          </ul>
        `,
        employmentType: "contract",
        location: "Germany",
        salaryFrom: 80000,
        salaryTo: 120000,
        listingDuration: 30,
        benefits: ["Flexible Schedule", "Creative Freedom", "Learning Budget"],
        status: "ACTIVE" as const,
        companyId: companyIds[1],
      },
      {
        jobTitle: "Data Scientist Intern",
        jobDescription: `
          <p>Join our data science team as an intern and work on real-world machine learning projects.</p>
          
          <h3>What you'll learn:</h3>
          <ul>
            <li>Data analysis and visualization techniques</li>
            <li>Machine learning model development</li>
            <li>Working with large datasets</li>
            <li>Statistical analysis and hypothesis testing</li>
            <li>Presenting findings to stakeholders</li>
          </ul>
          
          <h3>Requirements:</h3>
          <ul>
            <li>Currently pursuing degree in Data Science, Statistics, or related field</li>
            <li>Knowledge of Python and data science libraries (pandas, numpy, scikit-learn)</li>
            <li>Understanding of statistical concepts</li>
            <li>Strong analytical and problem-solving skills</li>
            <li>Eagerness to learn and contribute</li>
          </ul>
        `,
        employmentType: "internship",
        location: "Remote",
        salaryFrom: 25000,
        salaryTo: 35000,
        listingDuration: 30,
        benefits: ["Mentorship", "Learning Opportunities", "Flexible Schedule"],
        status: "ACTIVE" as const,
        companyId: companyIds[2],
      },
      {
        jobTitle: "Software Engineer",
        jobDescription: `
          <p>We're looking for a talented Software Engineer to join our Berlin office and work on cutting-edge web applications.</p>
          
          <h3>What you'll do:</h3>
          <ul>
            <li>Develop scalable web applications using modern technologies</li>
            <li>Collaborate with cross-functional teams in an agile environment</li>
            <li>Write clean, maintainable code following best practices</li>
            <li>Participate in code reviews and technical discussions</li>
            <li>Contribute to architectural decisions and system design</li>
          </ul>
          
          <h3>Requirements:</h3>
          <ul>
            <li>3+ years of software development experience</li>
            <li>Proficiency in JavaScript/TypeScript and React</li>
            <li>Experience with Node.js and modern web frameworks</li>
            <li>Knowledge of databases (PostgreSQL, MongoDB)</li>
            <li>Understanding of cloud platforms (AWS, Azure)</li>
            <li>Strong problem-solving and communication skills</li>
          </ul>
        `,
        employmentType: "full-time",
        location: "Germany",
        salaryFrom: 70000,
        salaryTo: 95000,
        listingDuration: 30,
        benefits: ["Health Insurance", "Professional Development", "Flexible Hours", "Home Office"],
        status: "ACTIVE" as const,
        companyId: companyIds[0],
      }
    ];

    // Create jobs
    for (const jobData of jobs) {
      console.log(`Creating job: ${jobData.jobTitle}`);
      await createJob(jobData);
    }

    // Create a sample job seeker
    console.log("Creating sample job seeker...");
    const jobSeekerUserId = await createUser({
      name: "John Doe",
      email: "john.doe@example.com",
      onboardingComplete: true,
      userType: "JOB_SEEKER",
    });

    await createJobSeeker({
      name: "John Doe",
      about: "Experienced software developer passionate about creating innovative solutions.",
      resume: "https://example.com/resume.pdf",
      userId: jobSeekerUserId,
    });

    console.log("✅ Firebase seeding completed successfully!");
    console.log(`Created ${companies.length} companies and ${jobs.length} jobs`);
    
  } catch (error) {
    console.error("❌ Error seeding Firebase:", error);
  }
};

seedData();