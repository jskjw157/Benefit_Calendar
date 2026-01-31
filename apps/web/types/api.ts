export type EmploymentStatus = "JOB_SEEKER" | "EMPLOYED" | "STUDENT" | "SELF_EMPLOYED";

export type NotificationChannel = "EMAIL" | "SMS" | "PUSH";

export type User = {
  id: string;
  email: string;
  age: number;
  region: string;
  employmentStatus: EmploymentStatus;
  isSelfEmployed: boolean;
  notificationChannel: NotificationChannel;
};

export type BenefitStatus = "OPEN" | "CLOSED";

export type Benefit = {
  id: string;
  title: string;
  agency: string;
  category: string;
  region: string;
  amount: string;
  applyPeriod: {
    start: string;
    end: string;
  };
  deadline: string;
  status: BenefitStatus;
  applicationLink: string;
  requirements: string[];
  documents: string[];
};

export type UserBenefitStatus = "BOOKMARKED" | "PREPARING" | "APPLIED" | "RECEIVED";

export type UserBenefit = {
  userId: string;
  benefitId: string;
  status: UserBenefitStatus;
  createdAt: string;
};

export type ApiMeta = {
  requestId: string;
  timestamp: string;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: ApiMeta;
};

export type ApiErrorDetail = {
  field: string;
  reason: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  meta: ApiMeta;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type PagedData<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};
