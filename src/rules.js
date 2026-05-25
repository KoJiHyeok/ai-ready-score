'use strict';

const { hasAnyKeyword } = require('./utils');

const categories = [
  {
    id: 'documentation',
    name: 'Documentation',
    maxScore: 25
  },
  {
    id: 'projectStructure',
    name: 'Project Structure',
    maxScore: 20
  },
  {
    id: 'packageScripts',
    name: 'Package Scripts',
    maxScore: 20
  },
  {
    id: 'aiReadiness',
    name: 'AI Readiness',
    maxScore: 20
  },
  {
    id: 'githubSafety',
    name: 'GitHub & Safety Readiness',
    maxScore: 15
  }
];

const rules = [
  {
    id: 'readme-exists',
    category: 'documentation',
    label: 'README.md exists',
    points: 8,
    recommendation: 'Add a README.md at the project root.',
    test: (scan) => scan.files.includes('README.md')
  },
  {
    id: 'readme-purpose',
    category: 'documentation',
    label: 'README explains project purpose',
    points: 4,
    recommendation: 'Explain what the project does and why it exists in README.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['README.md'], ['overview', 'purpose', 'why this exists', 'what it does'])
  },
  {
    id: 'readme-installation',
    category: 'documentation',
    label: 'README has installation instructions',
    points: 4,
    recommendation: 'Add installation instructions to README.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['README.md'], ['installation', 'install'])
  },
  {
    id: 'readme-usage',
    category: 'documentation',
    label: 'README has usage instructions',
    points: 5,
    recommendation: 'Add CLI usage examples to README.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['README.md'], ['usage', 'example output', 'how to run'])
  },
  {
    id: 'readme-structure',
    category: 'documentation',
    label: 'README explains project structure',
    points: 4,
    recommendation: 'Document the repository layout in README.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['README.md'], ['project structure', 'repository structure', 'folder structure'])
  },
  {
    id: 'src-exists',
    category: 'projectStructure',
    label: 'src/ exists',
    points: 6,
    recommendation: 'Move implementation code into a src/ directory.',
    test: (scan) => scan.directories.includes('src')
  },
  {
    id: 'tests-exists',
    category: 'projectStructure',
    label: 'tests/ or test/ exists',
    points: 5,
    recommendation: 'Add a tests/ or test/ directory.',
    test: (scan) => scan.directories.includes('tests') || scan.directories.includes('test')
  },
  {
    id: 'docs-exists',
    category: 'projectStructure',
    label: 'docs/ exists',
    points: 3,
    recommendation: 'Add a docs/ directory for deeper documentation.',
    test: (scan) => scan.directories.includes('docs')
  },
  {
    id: 'examples-exists',
    category: 'projectStructure',
    label: 'examples/ exists',
    points: 3,
    recommendation: 'Add an examples/ directory with sample projects or fixtures.',
    test: (scan) => scan.directories.includes('examples')
  },
  {
    id: 'scripts-or-bin-exists',
    category: 'projectStructure',
    label: 'scripts/ or bin/ exists',
    points: 3,
    recommendation: 'Add a bin/ or scripts/ directory for runnable commands.',
    test: (scan) => scan.directories.includes('scripts') || scan.directories.includes('bin')
  },
  {
    id: 'package-json-exists',
    category: 'packageScripts',
    label: 'package.json exists',
    points: 5,
    recommendation: 'Add a package.json file.',
    test: (scan) => scan.files.includes('package.json')
  },
  {
    id: 'script-dev-exists',
    category: 'packageScripts',
    label: 'scripts.dev exists',
    points: 4,
    recommendation: 'Add a dev script to package.json.',
    test: (scan) => Boolean(scan.packageJson.data && scan.packageJson.data.scripts && scan.packageJson.data.scripts.dev)
  },
  {
    id: 'script-start-exists',
    category: 'packageScripts',
    label: 'scripts.start exists',
    points: 3,
    recommendation: 'Add a start script to package.json.',
    test: (scan) => Boolean(scan.packageJson.data && scan.packageJson.data.scripts && scan.packageJson.data.scripts.start)
  },
  {
    id: 'script-test-exists',
    category: 'packageScripts',
    label: 'scripts.test exists',
    points: 5,
    recommendation: 'Add a test script to package.json.',
    test: (scan) => Boolean(scan.packageJson.data && scan.packageJson.data.scripts && scan.packageJson.data.scripts.test)
  },
  {
    id: 'script-build-or-check-exists',
    category: 'packageScripts',
    label: 'scripts.build or scripts.check exists',
    points: 3,
    recommendation: 'Add a build or check script to package.json.',
    test: (scan) => Boolean(scan.packageJson.data && scan.packageJson.data.scripts && (scan.packageJson.data.scripts.build || scan.packageJson.data.scripts.check))
  },
  {
    id: 'agents-exists',
    category: 'aiReadiness',
    label: 'AGENTS.md exists',
    points: 8,
    recommendation: 'Add AGENTS.md with instructions for AI coding agents.',
    test: (scan) => scan.files.includes('AGENTS.md')
  },
  {
    id: 'agents-overview',
    category: 'aiReadiness',
    label: 'AGENTS.md includes project overview',
    points: 3,
    recommendation: 'Add a project overview section to AGENTS.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['AGENTS.md'], ['project overview', 'overview'])
  },
  {
    id: 'agents-run',
    category: 'aiReadiness',
    label: 'AGENTS.md includes run instructions',
    points: 3,
    recommendation: 'Add run instructions to AGENTS.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['AGENTS.md'], ['how to run', 'run instructions', 'npm start'])
  },
  {
    id: 'agents-test',
    category: 'aiReadiness',
    label: 'AGENTS.md includes test instructions',
    points: 3,
    recommendation: 'Add test instructions to AGENTS.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['AGENTS.md'], ['how to test', 'test instructions', 'npm test', 'node:test'])
  },
  {
    id: 'agents-coding-rules',
    category: 'aiReadiness',
    label: 'AGENTS.md includes coding rules',
    points: 3,
    recommendation: 'Add coding rules to AGENTS.md.',
    test: (scan) => hasAnyKeyword(scan.rootFileContents['AGENTS.md'], ['coding guidelines', 'coding rules', 'commonjs'])
  },
  {
    id: 'gitignore-exists',
    category: 'githubSafety',
    label: '.gitignore exists',
    points: 4,
    recommendation: 'Add a .gitignore file.',
    test: (scan) => scan.files.includes('.gitignore')
  },
  {
    id: 'env-example-exists',
    category: 'githubSafety',
    label: '.env.example exists',
    points: 4,
    recommendation: 'Add .env.example to document expected environment variables.',
    test: (scan) => scan.files.includes('.env.example')
  },
  {
    id: 'license-exists',
    category: 'githubSafety',
    label: 'LICENSE exists',
    points: 3,
    recommendation: 'Add a LICENSE file.',
    test: (scan) => scan.files.includes('LICENSE')
  },
  {
    id: 'contributing-exists',
    category: 'githubSafety',
    label: 'CONTRIBUTING.md exists',
    points: 2,
    recommendation: 'Add CONTRIBUTING.md with contribution guidelines.',
    test: (scan) => scan.files.includes('CONTRIBUTING.md')
  },
  {
    id: 'no-sensitive-root-files',
    category: 'githubSafety',
    label: 'No obvious sensitive root files',
    points: 2,
    recommendation: 'Remove sensitive files from the project root and rotate exposed secrets.',
    test: (scan) => scan.sensitiveFiles.length === 0
  }
];

module.exports = {
  categories,
  rules
};
