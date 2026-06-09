export interface Alert {
  id: string;
  user: string;
  username: string;
  type: 'fake_account' | 'cyberbullying' | 'threat' | 'image_misuse' | 'suspicious_activity';
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  description: string;
  details?: string;
}

export interface FakeAccount {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  riskScore: number;
  suspiciousIndicators: string[];
  ipAddresses: string[];
  activities: string[];
  status: 'active' | 'suspended' | 'flagged';
}

export interface CyberbullyingCase {
  id: string;
  reporterId: string;
  targetId: string;
  targetUsername: string;
  message: string;
  timestamp: Date;
  severity: 'mild' | 'moderate' | 'severe';
  keywords: string[];
  status: 'new' | 'reviewing' | 'resolved';
}

export interface ThreatAlert {
  id: string;
  userId: string;
  username: string;
  threatText: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
  targetInfo?: string;
  status: 'open' | 'investigating' | 'escalated';
}

export interface ImageMisuseCase {
  id: string;
  originalUploader: string;
  misusingUsers: string[];
  imageCount: number;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  status: 'open' | 'resolved';
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  activity: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
  details?: string;
}

export interface InvestigationCase {
  id: string;
  userId: string;
  username: string;
  riskScore: number;
  startDate: Date;
  status: 'open' | 'active' | 'closed';
  incidents: Array<{
    type: string;
    timestamp: Date;
    description: string;
  }>;
  relatedAlerts: string[];
  notes: string[];
}

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    user: 'John Doe',
    username: '@johndoe123',
    type: 'fake_account',
    timestamp: daysAgo(0.5),
    riskLevel: 'critical',
    status: 'open',
    description: 'Multiple fake accounts detected sharing same IP and behavior patterns',
    details: 'Account created 2 days ago with suspicious activity pattern matching known fake account network'
  },
  {
    id: 'ALT-002',
    user: 'Sarah Johnson',
    username: '@sjohnson_tweets',
    type: 'cyberbullying',
    timestamp: daysAgo(1),
    riskLevel: 'high',
    status: 'investigating',
    description: 'Harassing messages directed at multiple users',
    details: 'Detected 23 harassing messages over 6 hours targeting specific user'
  },
  {
    id: 'ALT-003',
    user: 'Mike Wilson',
    username: '@mikew456',
    type: 'threat',
    timestamp: daysAgo(2),
    riskLevel: 'critical',
    status: 'investigating',
    description: 'Direct threat messages containing violent language',
    details: 'Messages contain specific threats and violent imagery'
  },
  {
    id: 'ALT-004',
    user: 'Alex Chen',
    username: '@alexchen_art',
    type: 'image_misuse',
    timestamp: daysAgo(3),
    riskLevel: 'high',
    status: 'resolved',
    description: 'Copyrighted artwork being reposted without attribution',
    details: '5 instances of original artwork reposted to 8 different accounts'
  },
  {
    id: 'ALT-005',
    user: 'Emily Rodriguez',
    username: '@emily_photo',
    type: 'image_misuse',
    timestamp: daysAgo(4),
    riskLevel: 'medium',
    status: 'open',
    description: 'Profile photos being used in catfishing schemes',
    details: 'Same image used across 12 suspicious accounts'
  },
  {
    id: 'ALT-006',
    user: 'David Park',
    username: '@davidpark_music',
    type: 'fake_account',
    timestamp: daysAgo(5),
    riskLevel: 'medium',
    status: 'investigating',
    description: 'Bot-like behavior detected with automated posting',
    details: 'Posts every 15 minutes with generic content'
  },
  {
    id: 'ALT-007',
    user: 'Lisa Thompson',
    username: '@lisathompson88',
    type: 'suspicious_activity',
    timestamp: daysAgo(6),
    riskLevel: 'medium',
    status: 'open',
    description: 'Unusual login patterns from multiple locations',
    details: 'Account accessed from 8 different countries in 24 hours'
  },
  {
    id: 'ALT-008',
    user: 'James Brown',
    username: '@jbrown_fitness',
    type: 'cyberbullying',
    timestamp: daysAgo(7),
    riskLevel: 'high',
    status: 'resolved',
    description: 'Targeted harassment campaign against fitness influencer',
    details: 'Coordinated attack with 47 related accounts'
  },
];

export const mockFakeAccounts: FakeAccount[] = [
  {
    id: 'FA-001',
    username: 'promo_bot_2024',
    email: 'promo.bot@temp.com',
    createdAt: daysAgo(10),
    riskScore: 95,
    suspiciousIndicators: [
      'Generic profile name',
      'No profile picture variation',
      'Automated posting pattern',
      'Spam-like content',
      'Matching IP with other bots'
    ],
    ipAddresses: ['192.168.1.105', '203.0.113.42'],
    activities: ['Posted 450 times in 10 days', 'Engaged with 2000+ users', 'Followed 5000 accounts'],
    status: 'flagged'
  },
  {
    id: 'FA-002',
    username: 'verify_user_official',
    email: 'verify.official@random.com',
    createdAt: daysAgo(15),
    riskScore: 92,
    suspiciousIndicators: [
      'Name impersonation attempt',
      'Similar to official account',
      'Blue check claim without verification',
      'Redirecting users to external site'
    ],
    ipAddresses: ['198.51.100.8'],
    activities: ['DM phishing attempts', 'Posted verification scams'],
    status: 'active'
  },
  {
    id: 'FA-003',
    username: 'fake_celeb_account',
    email: 'celeb.fake@mail.com',
    createdAt: daysAgo(20),
    riskScore: 88,
    suspiciousIndicators: [
      'Celebrity impersonation',
      'Stolen photos',
      'Engagement farming',
      'Malware links shared'
    ],
    ipAddresses: ['203.0.113.101'],
    activities: ['Engaged 8000+ followers', 'Shared malware links'],
    status: 'suspended'
  },
  {
    id: 'FA-004',
    username: 'dating_scam_bot',
    email: 'romance.scam@temp.com',
    createdAt: daysAgo(25),
    riskScore: 91,
    suspiciousIndicators: [
      'Romance scam indicators',
      'Catfishing behavior',
      'Money request patterns',
      'Stolen identity'
    ],
    ipAddresses: ['192.0.2.50', '198.51.100.15'],
    activities: ['Targeted 150+ users', 'Requested money 45 times'],
    status: 'flagged'
  },
  {
    id: 'FA-005',
    username: 'crypto_pump_fake',
    email: 'crypto.pump@mail.com',
    createdAt: daysAgo(8),
    riskScore: 87,
    suspiciousIndicators: [
      'Pump and dump scheme',
      'Financial fraud indicators',
      'Misleading claims',
      'Group coordination detected'
    ],
    ipAddresses: ['203.0.113.200'],
    activities: ['Promoted 12 scam coins', 'Coordinated with 45 other accounts'],
    status: 'active'
  },
];

export const mockCyberbullyingCases: CyberbullyingCase[] = [
  {
    id: 'CB-001',
    reporterId: 'report_user_1',
    targetId: 'target_001',
    targetUsername: '@alex_student',
    message: 'You\'re so stupid, nobody likes you. Everyone laughs at you behind your back.',
    timestamp: daysAgo(0.2),
    severity: 'severe',
    keywords: ['stupid', 'nobody likes', 'laughs at'],
    status: 'new'
  },
  {
    id: 'CB-002',
    reporterId: 'report_user_2',
    targetId: 'target_002',
    targetUsername: '@jordan_art',
    message: 'Your art is terrible. Stop wasting everyone\'s time with your garbage drawings.',
    timestamp: daysAgo(0.5),
    severity: 'moderate',
    keywords: ['terrible', 'garbage', 'waste'],
    status: 'reviewing'
  },
  {
    id: 'CB-003',
    reporterId: 'report_user_3',
    targetId: 'target_003',
    targetUsername: '@sam_gamer',
    message: 'Loser alert! 🚨 You suck at gaming, just quit already.',
    timestamp: daysAgo(1),
    severity: 'moderate',
    keywords: ['loser', 'suck', 'quit'],
    status: 'reviewing'
  },
  {
    id: 'CB-004',
    reporterId: 'report_user_4',
    targetId: 'target_004',
    targetUsername: '@maya_fitness',
    message: 'Ugly faker. Your whole life is a lie. Everyone knows it.',
    timestamp: daysAgo(2),
    severity: 'severe',
    keywords: ['ugly', 'faker', 'lie'],
    status: 'resolved'
  },
  {
    id: 'CB-005',
    reporterId: 'report_user_5',
    targetId: 'target_005',
    targetUsername: '@chris_music',
    message: 'Your music is cringe. You have no talent whatsoever.',
    timestamp: daysAgo(3),
    severity: 'mild',
    keywords: ['cringe', 'no talent'],
    status: 'resolved'
  },
];

export const mockThreatAlerts: ThreatAlert[] = [
  {
    id: 'TH-001',
    userId: 'user_threat_1',
    username: '@threat_user_1',
    threatText: 'I know where you live. I\'m coming for you.',
    timestamp: daysAgo(0.3),
    severity: 'critical',
    keywords: ['know where', 'coming for you'],
    targetInfo: 'Address extracted from profile history',
    status: 'escalated'
  },
  {
    id: 'TH-002',
    userId: 'user_threat_2',
    username: '@aggressive_user',
    threatText: 'You deserve to die for what you did.',
    timestamp: daysAgo(1),
    severity: 'critical',
    keywords: ['deserve to die'],
    status: 'investigating'
  },
  {
    id: 'TH-003',
    userId: 'user_threat_3',
    username: '@angry_person',
    threatText: 'I\'m going to burn your house down.',
    timestamp: daysAgo(2),
    severity: 'critical',
    keywords: ['burn', 'house down'],
    targetInfo: 'Physical location information available',
    status: 'investigating'
  },
  {
    id: 'TH-004',
    userId: 'user_threat_4',
    username: '@hostile_account',
    threatText: 'You\'ll pay for this. Not joking.',
    timestamp: daysAgo(3),
    severity: 'high',
    keywords: ['pay for this', 'not joking'],
    status: 'investigating'
  },
  {
    id: 'TH-005',
    userId: 'user_threat_5',
    username: '@aggressive_follower',
    threatText: 'I\'m going to find you and beat you up.',
    timestamp: daysAgo(4),
    severity: 'critical',
    keywords: ['beat you up'],
    status: 'open'
  },
];

export const mockImageMisuseCases: ImageMisuseCase[] = [
  {
    id: 'IM-001',
    originalUploader: '@alice_photographer',
    misusingUsers: ['@fake_alice', '@photo_stealer_1', '@content_farm_2'],
    imageCount: 47,
    timestamp: daysAgo(1),
    riskLevel: 'high',
    description: 'Professional photography being reposted across 8+ accounts without attribution',
    status: 'open'
  },
  {
    id: 'IM-002',
    originalUploader: '@design_studio',
    misusingUsers: ['@scam_designer', '@fake_studio_account'],
    imageCount: 23,
    timestamp: daysAgo(5),
    riskLevel: 'high',
    description: 'Design portfolio images being used in fake business accounts',
    status: 'resolved'
  },
  {
    id: 'IM-003',
    originalUploader: '@vacation_photos',
    misusingUsers: ['@catfish_account_1', '@romance_scammer', '@fake_profile'],
    imageCount: 12,
    timestamp: daysAgo(7),
    riskLevel: 'medium',
    description: 'Personal photos being used for catfishing and romance scams',
    status: 'open'
  },
  {
    id: 'IM-004',
    originalUploader: '@artist_creator',
    misusingUsers: ['@art_stealer_network_1', '@art_stealer_network_2', '@art_stealer_network_3'],
    imageCount: 156,
    timestamp: daysAgo(10),
    riskLevel: 'high',
    description: 'Digital art being sold illegally across multiple spam accounts',
    status: 'open'
  },
  {
    id: 'IM-005',
    originalUploader: '@product_brand',
    misusingUsers: ['@counterfeit_seller', '@fake_store'],
    imageCount: 89,
    timestamp: daysAgo(15),
    riskLevel: 'medium',
    description: 'Product images being used to advertise counterfeit goods',
    status: 'resolved'
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'LOG-001',
    userId: 'admin_user_1',
    username: 'John Admin',
    activity: 'Reviewed alert ALT-001',
    timestamp: daysAgo(0.1),
    status: 'success'
  },
  {
    id: 'LOG-002',
    userId: 'moderator_1',
    username: 'Sarah Moderator',
    activity: 'Suspended account FA-001',
    timestamp: daysAgo(0.2),
    status: 'success'
  },
  {
    id: 'LOG-003',
    userId: 'investigator_1',
    username: 'Mike Investigator',
    activity: 'Escalated threat alert TH-001 to law enforcement',
    timestamp: daysAgo(0.3),
    status: 'success'
  },
  {
    id: 'LOG-004',
    userId: 'analyst_1',
    username: 'Emma Analyst',
    activity: 'Generated monthly report',
    timestamp: daysAgo(1),
    status: 'success'
  },
  {
    id: 'LOG-005',
    userId: 'admin_user_1',
    username: 'John Admin',
    activity: 'Updated threat detection threshold',
    timestamp: daysAgo(2),
    status: 'success'
  },
  {
    id: 'LOG-006',
    userId: 'moderator_2',
    username: 'Alex Moderator',
    activity: 'Attempted to delete admin account',
    timestamp: daysAgo(3),
    status: 'error'
  },
  {
    id: 'LOG-007',
    userId: 'investigator_1',
    username: 'Mike Investigator',
    activity: 'Downloaded investigation case INV-015',
    timestamp: daysAgo(4),
    status: 'success'
  },
  {
    id: 'LOG-008',
    userId: 'analyst_1',
    username: 'Emma Analyst',
    activity: 'Modified alert filter settings',
    timestamp: daysAgo(5),
    status: 'warning'
  },
];

export const mockInvestigationCases: InvestigationCase[] = [
  {
    id: 'INV-001',
    userId: 'user_investigate_1',
    username: '@suspicious_account_001',
    riskScore: 96,
    startDate: daysAgo(3),
    status: 'active',
    incidents: [
      {
        type: 'Account Creation',
        timestamp: daysAgo(20),
        description: 'Account created with fake profile information'
      },
      {
        type: 'Fake Activity',
        timestamp: daysAgo(18),
        description: 'Automated posting detected - 200+ posts in 48 hours'
      },
      {
        type: 'Cyberbullying',
        timestamp: daysAgo(10),
        description: 'Harassing messages to 15+ users detected'
      },
      {
        type: 'Threat',
        timestamp: daysAgo(5),
        description: 'Direct threats with location targeting'
      },
      {
        type: 'Network',
        timestamp: daysAgo(3),
        description: 'Connected to 8 other suspicious accounts'
      }
    ],
    relatedAlerts: ['ALT-001', 'ALT-002', 'ALT-003'],
    notes: [
      'Part of coordinated fake account network',
      'Similar IP patterns to 7 other flagged accounts',
      'Recommend immediate suspension and law enforcement notification'
    ]
  },
  {
    id: 'INV-002',
    userId: 'user_investigate_2',
    username: '@catfish_romance_001',
    riskScore: 88,
    startDate: daysAgo(14),
    status: 'active',
    incidents: [
      {
        type: 'Account Creation',
        timestamp: daysAgo(45),
        description: 'Account created with stolen profile photos'
      },
      {
        type: 'Image Misuse',
        timestamp: daysAgo(40),
        description: 'Photos identified as stolen from legitimate user'
      },
      {
        type: 'Fraud Attempt',
        timestamp: daysAgo(15),
        description: 'Romance scam messages requesting financial assistance'
      },
      {
        type: 'Escalation',
        timestamp: daysAgo(5),
        description: 'Victim reported emotional manipulation and money transfer'
      }
    ],
    relatedAlerts: ['ALT-005'],
    notes: [
      'Victim lost $2,500 before reporting',
      'Pattern matches known romance scam operator',
      'Additional investigation for financial crime referral needed'
    ]
  },
  {
    id: 'INV-003',
    userId: 'user_investigate_3',
    username: '@crypto_pump_operator',
    riskScore: 85,
    startDate: daysAgo(7),
    status: 'open',
    incidents: [
      {
        type: 'Pump and Dump',
        timestamp: daysAgo(20),
        description: 'Promoting worthless cryptocurrency to followers'
      },
      {
        type: 'Network Activity',
        timestamp: daysAgo(15),
        description: 'Coordinated activity with 30+ bot accounts'
      },
      {
        type: 'Financial Fraud',
        timestamp: daysAgo(7),
        description: 'Users report significant losses from investment'
      }
    ],
    relatedAlerts: [],
    notes: [
      'Estimated victim losses: $50,000+',
      'SEC referral required',
      'Monitor for next scam coin promotion'
    ]
  },
];

export const dashboardStats = {
  totalUsersMonitored: 45230,
  fakeAccountsDetected: 1247,
  harassmentCasesDetected: 892,
  threatAlerts: 156,
  imageMisuseCases: 234,
  highRiskUsers: 47
};

export const activityTrend = [
  { date: 'Jan 1', alerts: 12, cases: 8, threats: 3 },
  { date: 'Jan 2', alerts: 15, cases: 10, threats: 4 },
  { date: 'Jan 3', alerts: 18, cases: 12, threats: 5 },
  { date: 'Jan 4', alerts: 22, cases: 14, threats: 6 },
  { date: 'Jan 5', alerts: 25, cases: 16, threats: 7 },
  { date: 'Jan 6', alerts: 28, cases: 18, threats: 8 },
  { date: 'Jan 7', alerts: 32, cases: 21, threats: 9 },
  { date: 'Jan 8', alerts: 35, cases: 23, threats: 10 },
];

export const alertDistribution = [
  { type: 'Fake Accounts', value: 340, color: '#4A90E2' },
  { type: 'Cyberbullying', value: 280, color: '#F59E0B' },
  { type: 'Threats', value: 156, color: '#EF4444' },
  { type: 'Image Misuse', value: 234, color: '#14B8A6' },
  { type: 'Suspicious Activity', value: 190, color: '#8B5CF6' },
];

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  accountStatus: 'active' | 'suspended' | 'flagged';
  riskScore: number;
  joinDate: Date;
  lastLogin: Date;
  activityCount: number;
  alertsCount: number;
}

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    username: '@johndoe123',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    accountStatus: 'active',
    riskScore: 25,
    joinDate: daysAgo(180),
    lastLogin: daysAgo(0.5),
    activityCount: 245,
    alertsCount: 3
  },
  {
    id: 'USR-002',
    username: '@sarahj_tweets',
    email: 'sarah.johnson@example.com',
    fullName: 'Sarah Johnson',
    accountStatus: 'flagged',
    riskScore: 78,
    joinDate: daysAgo(120),
    lastLogin: daysAgo(2),
    activityCount: 892,
    alertsCount: 12
  },
  {
    id: 'USR-003',
    username: '@mikew456',
    email: 'mike.wilson@example.com',
    fullName: 'Mike Wilson',
    accountStatus: 'suspended',
    riskScore: 95,
    joinDate: daysAgo(90),
    lastLogin: daysAgo(10),
    activityCount: 1234,
    alertsCount: 28
  },
  {
    id: 'USR-004',
    username: '@alexchen_art',
    email: 'alex.chen@example.com',
    fullName: 'Alex Chen',
    accountStatus: 'active',
    riskScore: 15,
    joinDate: daysAgo(200),
    lastLogin: daysAgo(0.1),
    activityCount: 567,
    alertsCount: 2
  },
  {
    id: 'USR-005',
    username: '@emilyrodriguez',
    email: 'emily.r@example.com',
    fullName: 'Emily Rodriguez',
    accountStatus: 'active',
    riskScore: 42,
    joinDate: daysAgo(150),
    lastLogin: daysAgo(1),
    activityCount: 678,
    alertsCount: 8
  },
  {
    id: 'USR-006',
    username: '@davidpark_music',
    email: 'david.park@example.com',
    fullName: 'David Park',
    accountStatus: 'flagged',
    riskScore: 63,
    joinDate: daysAgo(100),
    lastLogin: daysAgo(3),
    activityCount: 432,
    alertsCount: 15
  },
  {
    id: 'USR-007',
    username: '@lisathompson88',
    email: 'lisa.t@example.com',
    fullName: 'Lisa Thompson',
    accountStatus: 'active',
    riskScore: 38,
    joinDate: daysAgo(160),
    lastLogin: daysAgo(0.5),
    activityCount: 234,
    alertsCount: 5
  },
  {
    id: 'USR-008',
    username: '@jbrown_fitness',
    email: 'james.brown@example.com',
    fullName: 'James Brown',
    accountStatus: 'active',
    riskScore: 22,
    joinDate: daysAgo(210),
    lastLogin: daysAgo(0.2),
    activityCount: 890,
    alertsCount: 4
  },
];

export const adminUser = {
  id: 'ADM-001',
  username: 'admin',
  email: 'admin@safesocial.com',
  fullName: 'John Admin',
  password: 'admin123',
};
