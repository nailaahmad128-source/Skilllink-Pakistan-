import { z } from "zod";

export const pkPhoneRegex = /^(\+92|0)?3\d{9}$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    role: z.enum(["seeker", "employer"]),
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(80),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .regex(pkPhoneRegex, "Enter a valid Pakistani number, e.g. 03001234567"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
    companyName: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.role !== "employer" || (data.companyName && data.companyName.length > 1), {
    message: "Company name is required for employer accounts",
    path: ["companyName"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const jobPostSchema = z.object({
  title: z.string().trim().min(3, "Job title is required").max(120),
  description: z.string().trim().min(30, "Description should be at least 30 characters"),
  categoryId: z.string().uuid("Please select a category"),
  city: z.string().trim().min(1, "City is required"),
  jobType: z.enum(["Full Time", "Part Time", "Contract", "Remote", "Overseas"]),
  salaryMin: z.coerce.number().int().nonnegative().optional().nullable(),
  salaryMax: z.coerce.number().int().nonnegative().optional().nullable(),
  experienceLevel: z.string().trim().optional(),
  requirements: z.string().trim().optional(),
}).refine(
  (d) => !d.salaryMin || !d.salaryMax || d.salaryMax >= d.salaryMin,
  { message: "Maximum salary must be greater than minimum", path: ["salaryMax"] }
);

export const seekerProfileSchema = z.object({
  headline: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(2000).optional(),
  city: z.string().trim().min(1, "City is required"),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
  education: z.string().trim().max(200).optional(),
  skills: z.array(z.string()).optional(),
  linkedinUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
});

export const employerProfileSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required").max(150),
  industry: z.string().trim().optional(),
  companySize: z.string().trim().optional(),
  website: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional(),
  city: z.string().trim().optional(),
});

export const applicationSchema = z.object({
  coverLetter: z.string().trim().max(3000).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(2, "Subject is required"),
  message: z.string().trim().min(10, "Message should be at least 10 characters"),
});

// Small helper: run a zod schema and return { data, errors } instead of throwing.
export function validate(schema, payload) {
  const result = schema.safeParse(payload);
  if (result.success) return { data: result.data, errors: null };
  const errors = {};
  for (const issue of result.error.issues) {
    errors[issue.path[0]] = issue.message;
  }
  return { data: null, errors };
}
