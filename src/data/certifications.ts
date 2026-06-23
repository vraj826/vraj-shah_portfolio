export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  verifyUrl: string;
  credentialId?: string;
  category: 'cybersecurity' | 'cloud' | 'opensource' | 'ai' | 'space';
}

export const certificationCategories = [
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🛡️' },
  { id: 'cloud', label: 'Cloud', icon: '☁️' },
  { id: 'opensource', label: 'Open Source', icon: '🔓' },
  { id: 'ai', label: 'AI & ML', icon: '🤖' },
  { id: 'space', label: 'Space Science', icon: '🌌' },
];

export const certifications: Certification[] = [
  {
    id: 'cert-001',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'Oct 2025',
    verifyUrl: 'https://aws.amazon.com',
    credentialId: 'AWS-CCP-100293',
    category: 'cloud',
  },
  {
    id: 'cert-002',
    name: 'Junior Cybersecurity Analyst Certificate',
    issuer: 'Cisco Networking Academy',
    date: 'Aug 2024',
    verifyUrl: 'https://netacad.com',
    credentialId: 'CISCO-JCA-88190',
    category: 'cybersecurity',
  },
  {
    id: 'cert-003',
    name: 'Introduction to Linux Kernel Security',
    issuer: 'The Linux Foundation (LFS101)',
    date: 'Dec 2024',
    verifyUrl: 'https://training.linuxfoundation.org',
    category: 'opensource',
  },
  {
    id: 'cert-004',
    name: 'NASA Open Science 101',
    issuer: 'NASA (Transform to Open Science)',
    date: 'Mar 2025',
    verifyUrl: 'https://openscience.nasa.gov',
    credentialId: 'NASA-TOPS-198273',
    category: 'space',
  },
  {
    id: 'cert-005',
    name: 'Machine Learning Security and Robustness',
    issuer: 'Coursera / DeepLearning.AI',
    date: 'Sep 2025',
    verifyUrl: 'https://coursera.org',
    category: 'ai',
  },
  {
    id: 'cert-006',
    name: 'CompTIA Security+ (Self-Study Coursework)',
    issuer: 'CompTIA Academy Partner',
    date: 'Apr 2024',
    verifyUrl: 'https://comptia.org',
    category: 'cybersecurity',
  },
];
