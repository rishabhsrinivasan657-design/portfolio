import config from '~/config';
import type { IconName } from '~/components/icon';

export const navLinks = [
  { label: 'Experience', pathname: '/#experience' },
  { label: 'Work', pathname: '/#project-1' },
  { label: 'Analysis', pathname: '/#analytics' },
  { label: 'About', pathname: '/#about' },
  { label: 'Contact', pathname: '/#contact' },
];

export const socialLinks: Array<{ label: string; url: string; icon: IconName }> = [
  { label: 'GitHub', url: config.github, icon: 'github' },
  { label: 'LinkedIn', url: config.linkedin, icon: 'linkedin' },
  { label: 'Email', url: `mailto:${config.email}`, icon: 'mail' },
];
