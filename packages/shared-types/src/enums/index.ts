export enum BenefitCategory {
  HOUSING = '주거',
  TRANSPORT = '교통',
  CULTURE = '문화',
  STARTUP = '창업',
  LIVING = '생활',
  EDUCATION = '교육',
  MEDICAL = '의료',
}

export enum BenefitStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum UserBenefitStatus {
  BOOKMARKED = 'BOOKMARKED',
  PREPARING = 'PREPARING',
  APPLIED = 'APPLIED',
  RECEIVED = 'RECEIVED',
}

export enum EmploymentStatus {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYED = 'EMPLOYED',
  STUDENT = 'STUDENT',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}
