const fs = require('fs');

let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const navReplacement = `const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'DEPARTMENT_OFFICER', 'FIELD_WORKER', 'AUDITOR'] },
  { name: 'Families', path: '/families', icon: Users, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'FIELD_WORKER', 'AUDITOR'] },
  { name: 'Schemes', path: '/schemes', icon: FileText, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'DEPARTMENT_OFFICER', 'AUDITOR'] },
  { name: 'Benefits', path: '/benefits', icon: HeartHandshake, roles: ['STATE_ADMIN', 'DEPARTMENT_OFFICER', 'AUDITOR'] },
  { name: 'Applications', path: '/applications', icon: FileText, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'FIELD_WORKER', 'AUDITOR'] },
  { name: 'Conflicts', path: '/conflicts', icon: AlertTriangle, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'AUDITOR'] },
  { name: 'Events', path: '/events', icon: Calendar, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'FIELD_WORKER'] },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['STATE_ADMIN', 'DISTRICT_OFFICER', 'DEPARTMENT_OFFICER'] },
  { name: 'Admin', path: '/admin', icon: Settings, roles: ['STATE_ADMIN'] },
];`;

content = content.replace(/const navItems = \[[\s\S]*?\];/, navReplacement);

const mapReplacement = `{navItems.filter(item => !user || item.roles.includes(user.role)).map((item) => {`;
content = content.replace(/{navItems\.map\(\(item\) => \{/, mapReplacement);

fs.writeFileSync('src/components/Layout.tsx', content);
