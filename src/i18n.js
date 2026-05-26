'use strict';

const DEFAULT_LANGUAGE = 'ko';
const SUPPORTED_LANGUAGES = ['ko', 'en'];

const messages = {
  en: {
    report: {
      title: 'ai-ready-score',
      targetPath: 'Target path',
      totalScore: 'Total score',
      grade: 'Grade',
      threshold: 'Score threshold',
      thresholdPassed: 'Passed score threshold: {score}/{maxScore} is at least {minScore}.',
      thresholdFailed: 'Failed score threshold: {score}/{maxScore} is below {minScore}.',
      configStatus: 'Config status',
      configPassed: 'Passed configured checks',
      configFailed: 'Failed configured checks',
      configuredChecks: 'Configured checks',
      configFile: 'Config file',
      configFailureMode: 'Config failure mode',
      configFailureEnabled: 'fail command when configured checks fail',
      configFailureDisabled: 'report only',
      configRequiredFile: 'Required file exists: {path}',
      configRequiredDirectory: 'Required directory exists: {path}',
      configRequiredPackageScript: 'Required package script exists: {path}',
      configForbiddenFile: 'Forbidden file is absent: {path}',
      categoryBreakdown: 'Category breakdown',
      passedChecks: 'Passed checks',
      failedChecks: 'Failed checks',
      warnings: 'Warnings',
      recommendations: 'Recommended next steps',
      none: 'None',
      pass: 'pass',
      fail: 'fail',
      noRecommendations: 'No immediate next steps. Keep docs and tests current as the project changes.'
    },
    init: {
      title: 'ai-ready-score initialization',
      markdownTitle: 'AI-Ready Initialization Report',
      targetPath: 'Target path',
      completed: 'AI-ready initialization is complete.',
      createdItems: 'Created items',
      skippedItems: 'Skipped items',
      nothingCreated: 'Nothing to create. The basic structure is already present.',
      none: 'None',
      alreadyExists: 'already exists'
    },
    markdown: {
      title: 'AI-Ready Codebase Report',
      target: 'Target',
      score: 'Score',
      grade: 'Grade',
      categoryBreakdown: 'Category Breakdown',
      passedChecks: 'Passed Checks',
      failedChecks: 'Failed Checks',
      warnings: 'Warnings',
      recommendations: 'Recommended Next Steps',
      category: 'Category',
      points: 'Points',
      check: 'Check'
    },
    help: {
      description: 'Score how ready a local codebase is for AI coding agents.',
      usage: 'Usage:',
      options: 'Options:',
      examples: 'Examples:',
      json: 'Print valid JSON output',
      markdown: 'Print a Markdown report',
      init: 'Create missing starter AI-readiness files and folders',
      minScore: 'Fail with exit code 1 when score is below this number',
      config: 'Read project-specific checks from a JSON config file',
      output: 'Write the report to a file',
      lang: 'Set human-readable output language: ko or en',
      help: 'Show this help text',
      version: 'Show the package version'
    },
    categories: {
      documentation: 'Documentation',
      projectStructure: 'Project Structure',
      packageScripts: 'Package Scripts',
      aiReadiness: 'AI Readiness',
      githubSafety: 'GitHub & Safety Readiness'
    },
    checks: {
      'readme-exists': 'README.md exists',
      'readme-purpose': 'README explains project purpose',
      'readme-installation': 'README has installation instructions',
      'readme-usage': 'README has usage instructions',
      'readme-structure': 'README explains project structure',
      'src-exists': 'src/ exists',
      'tests-exists': 'tests/ or test/ exists',
      'docs-exists': 'docs/ exists',
      'examples-exists': 'examples/ exists',
      'scripts-or-bin-exists': 'scripts/ or bin/ exists',
      'package-json-exists': 'package.json exists',
      'script-dev-exists': 'scripts.dev exists',
      'script-start-exists': 'scripts.start exists',
      'script-test-exists': 'scripts.test exists',
      'script-build-or-check-exists': 'scripts.build or scripts.check exists',
      'agents-exists': 'AGENTS.md exists',
      'agents-overview': 'AGENTS.md includes project overview',
      'agents-run': 'AGENTS.md includes run instructions',
      'agents-test': 'AGENTS.md includes test instructions',
      'agents-coding-rules': 'AGENTS.md includes coding rules',
      'gitignore-exists': '.gitignore exists',
      'env-example-exists': '.env.example exists',
      'license-exists': 'LICENSE exists',
      'contributing-exists': 'CONTRIBUTING.md exists',
      'no-sensitive-root-files': 'No obvious sensitive root files'
    },
    recommendations: {
      'readme-exists': 'Add a README.md at the project root.',
      'readme-purpose': 'Explain what the project does and why it exists in README.md.',
      'readme-installation': 'Add installation instructions to README.md.',
      'readme-usage': 'Add CLI usage examples to README.md.',
      'readme-structure': 'Document the repository layout in README.md.',
      'src-exists': 'Move implementation code into a src/ directory.',
      'tests-exists': 'Add a tests/ or test/ directory.',
      'docs-exists': 'Add a docs/ directory for deeper documentation.',
      'examples-exists': 'Add an examples/ directory with sample projects or fixtures.',
      'scripts-or-bin-exists': 'Add a bin/ or scripts/ directory for runnable commands.',
      'package-json-exists': 'Add a package.json file.',
      'script-dev-exists': 'Add a dev script to package.json.',
      'script-start-exists': 'Add a start script to package.json.',
      'script-test-exists': 'Add a test script to package.json.',
      'script-build-or-check-exists': 'Add a build or check script to package.json.',
      'agents-exists': 'Add AGENTS.md with instructions for AI coding agents.',
      'agents-overview': 'Add a project overview section to AGENTS.md.',
      'agents-run': 'Add run instructions to AGENTS.md.',
      'agents-test': 'Add test instructions to AGENTS.md.',
      'agents-coding-rules': 'Add coding rules to AGENTS.md.',
      'gitignore-exists': 'Add a .gitignore file.',
      'env-example-exists': 'Add .env.example to document expected environment variables.',
      'license-exists': 'Add a LICENSE file.',
      'contributing-exists': 'Add CONTRIBUTING.md with contribution guidelines.',
      'no-sensitive-root-files': 'Remove sensitive files from the project root and rotate exposed secrets.'
    }
  },
  ko: {
    init: {
      title: 'ai-ready-score 초기화',
      markdownTitle: 'AI-ready 초기화 리포트',
      targetPath: '대상 경로',
      completed: 'AI-ready 초기화가 완료되었습니다.',
      createdItems: '생성된 항목',
      skippedItems: '건너뛴 항목',
      nothingCreated: '생성할 항목이 없습니다. 이미 기본 구조가 준비되어 있습니다.',
      none: '없음',
      alreadyExists: '이미 있습니다'
    },
    report: {
      title: 'ai-ready-score',
      targetPath: '대상 경로',
      totalScore: '총점',
      grade: '등급',
      threshold: '점수 기준',
      thresholdPassed: '점수 기준 통과: {score}/{maxScore}점이 최소 {minScore}점 이상입니다.',
      thresholdFailed: '점수 기준 실패: {score}/{maxScore}점이 최소 {minScore}점보다 낮습니다.',
      categoryBreakdown: '카테고리별 점수',
      passedChecks: '통과한 검사',
      failedChecks: '실패한 검사',
      warnings: '경고',
      recommendations: '추천 다음 단계',
      none: '없음',
      pass: '통과',
      fail: '실패',
      noRecommendations: '바로 필요한 다음 단계는 없습니다. 프로젝트가 변경될 때 문서와 테스트를 최신 상태로 유지하세요.'
    },
    markdown: {
      title: 'AI 준비도 분석 리포트',
      target: '검사 대상',
      score: '총점',
      grade: '등급',
      categoryBreakdown: '카테고리별 점수',
      passedChecks: '통과한 항목',
      failedChecks: '실패한 항목',
      warnings: '경고',
      recommendations: '추천 작업',
      category: '카테고리',
      points: '점수',
      check: '항목'
    },
    help: {
      description: '로컬 코드베이스가 AI 코딩 에이전트에 얼마나 준비되어 있는지 점수화합니다.',
      usage: '사용법:',
      options: '옵션:',
      examples: '예시:',
      json: '올바른 JSON을 출력합니다',
      markdown: 'Markdown 리포트를 출력합니다',
      init: 'AI 작업 준비를 위한 기본 파일과 폴더를 생성합니다',
      minScore: '점수가 이 값보다 낮으면 종료 코드 1로 실패합니다',
      output: '보고서를 파일로 저장합니다',
      lang: '사람이 읽는 출력 언어를 설정합니다: ko 또는 en',
      help: '이 도움말을 표시합니다',
      version: '패키지 버전을 표시합니다'
    },
    categories: {
      documentation: '문서화',
      projectStructure: '프로젝트 구조',
      packageScripts: 'package.json 스크립트',
      aiReadiness: 'AI 작업 친화성',
      githubSafety: 'GitHub 및 보안 준비도'
    },
    checks: {
      'readme-exists': 'README.md가 있습니다.',
      'readme-purpose': 'README에 프로젝트 목적이 설명되어 있습니다.',
      'readme-installation': 'README에 설치 방법이 포함되어 있습니다.',
      'readme-usage': 'README에 사용 방법이 포함되어 있습니다.',
      'readme-structure': 'README에 프로젝트 구조 설명이 포함되어 있습니다.',
      'src-exists': 'src/ 폴더가 있습니다.',
      'tests-exists': 'tests/ 또는 test/ 폴더가 있습니다.',
      'docs-exists': 'docs/ 폴더가 있습니다.',
      'examples-exists': 'examples/ 폴더가 있습니다.',
      'scripts-or-bin-exists': 'scripts/ 또는 bin/ 폴더가 있습니다.',
      'package-json-exists': 'package.json이 있습니다.',
      'script-dev-exists': 'package.json에 dev 스크립트가 있습니다.',
      'script-start-exists': 'package.json에 start 스크립트가 있습니다.',
      'script-test-exists': 'package.json에 test 스크립트가 있습니다.',
      'script-build-or-check-exists': 'package.json에 build 또는 check 스크립트가 있습니다.',
      'agents-exists': 'AGENTS.md가 있습니다.',
      'agents-overview': 'AGENTS.md에 프로젝트 개요가 포함되어 있습니다.',
      'agents-run': 'AGENTS.md에 실행 방법이 포함되어 있습니다.',
      'agents-test': 'AGENTS.md에 테스트 방법이 포함되어 있습니다.',
      'agents-coding-rules': 'AGENTS.md에 코딩 규칙이 포함되어 있습니다.',
      'gitignore-exists': '.gitignore가 있습니다.',
      'env-example-exists': '.env.example이 있습니다.',
      'license-exists': 'LICENSE가 있습니다.',
      'contributing-exists': 'CONTRIBUTING.md가 있습니다.',
      'no-sensitive-root-files': '루트 폴더에 명백한 민감 파일이 없습니다.'
    },
    recommendations: {
      'readme-exists': '프로젝트 루트에 README.md를 추가하세요.',
      'readme-purpose': 'README.md에 프로젝트가 무엇을 하고 왜 필요한지 설명하세요.',
      'readme-installation': 'README.md에 설치 방법을 추가하세요.',
      'readme-usage': 'README.md에 CLI 사용 예시를 추가하세요.',
      'readme-structure': 'README.md에 저장소 구조를 설명하세요.',
      'src-exists': '구현 코드를 src/ 디렉터리로 옮기세요.',
      'tests-exists': 'tests/ 또는 test/ 디렉터리를 추가하세요.',
      'docs-exists': '더 자세한 문서를 위해 docs/ 디렉터리를 추가하세요.',
      'examples-exists': '샘플 프로젝트나 fixture를 담을 examples/ 디렉터리를 추가하세요.',
      'scripts-or-bin-exists': '실행 가능한 명령을 위해 bin/ 또는 scripts/ 디렉터리를 추가하세요.',
      'package-json-exists': 'package.json 파일을 추가하세요.',
      'script-dev-exists': 'package.json에 dev 스크립트를 추가하세요.',
      'script-start-exists': 'package.json에 start 스크립트를 추가하세요.',
      'script-test-exists': 'package.json에 test 스크립트를 추가하세요.',
      'script-build-or-check-exists': 'package.json에 build 또는 check 스크립트를 추가하세요.',
      'agents-exists': 'AI 코딩 에이전트가 참고할 수 있도록 AGENTS.md를 추가하세요.',
      'agents-overview': 'AGENTS.md에 프로젝트 개요 섹션을 추가하세요.',
      'agents-run': 'AGENTS.md에 실행 방법을 추가하세요.',
      'agents-test': 'AGENTS.md에 테스트 방법을 추가하세요.',
      'agents-coding-rules': 'AGENTS.md에 코딩 규칙을 추가하세요.',
      'gitignore-exists': '.gitignore 파일을 추가하세요.',
      'env-example-exists': '필요한 환경변수를 문서화하기 위해 .env.example을 추가하세요.',
      'license-exists': 'LICENSE 파일을 추가하세요.',
      'contributing-exists': '기여 방법을 설명하는 CONTRIBUTING.md를 추가하세요.',
      'no-sensitive-root-files': '프로젝트 루트에서 민감 파일을 제거하고 노출된 비밀값을 교체하세요.'
    }
  }
};

function normalizeLanguage(language) {
  return String(language || DEFAULT_LANGUAGE).toLowerCase();
}

function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(normalizeLanguage(language));
}

function getMessages(language) {
  const normalizedLanguage = normalizeLanguage(language);
  return messages[isSupportedLanguage(normalizedLanguage) ? normalizedLanguage : DEFAULT_LANGUAGE];
}

function getUnsupportedLanguageError(language) {
  return `지원하지 않는 언어입니다: ${language}. --lang ko 또는 --lang en을 사용하세요.`;
}

function getOutputFormatConflictError(language) {
  if (normalizeLanguage(language) === 'en') {
    return 'Select only one output format: --json or --markdown.';
  }

  return '출력 형식은 하나만 선택할 수 있습니다. --json 또는 --markdown 중 하나만 사용하세요.';
}

function getInvalidMinScoreError(value, language) {
  if (normalizeLanguage(language) === 'en') {
    return `--min-score requires a number from 0 to 100. Received: ${value}`;
  }

  return `--min-score에는 0부터 100까지의 숫자가 필요합니다. 입력값: ${value}`;
}

function getMinScoreInitConflictError(language) {
  if (normalizeLanguage(language) === 'en') {
    return '--min-score cannot be used with --init because init mode does not produce a score.';
  }

  return '--init 모드는 점수를 만들지 않으므로 --min-score와 함께 사용할 수 없습니다.';
}

function getConfigInitConflictError(language) {
  if (normalizeLanguage(language) === 'en') {
    return '--config cannot be used with --init because init mode does not produce a normal score report.';
  }

  return '--init 모드는 일반 점수 리포트를 만들지 않으므로 --config와 함께 사용할 수 없습니다.';
}

function translateWarning(warning, language) {
  if (normalizeLanguage(language) === 'en') {
    return warning;
  }

  if (warning.startsWith('Target path does not exist: ')) {
    return `대상 경로가 존재하지 않습니다: ${warning.slice('Target path does not exist: '.length)}`;
  }

  if (warning.startsWith('Target path is not a directory: ')) {
    return `대상 경로가 디렉터리가 아닙니다: ${warning.slice('Target path is not a directory: '.length)}`;
  }

  if (warning === 'package.json exists but could not be parsed.') {
    return 'package.json이 있지만 파싱할 수 없습니다.';
  }

  if (warning.startsWith('Sensitive file found in project root: ')) {
    return `프로젝트 루트에서 민감 파일을 발견했습니다: ${warning.slice('Sensitive file found in project root: '.length)}`;
  }

  return warning;
}

module.exports = {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getMessages,
  getConfigInitConflictError,
  getInvalidMinScoreError,
  getMinScoreInitConflictError,
  getOutputFormatConflictError,
  getUnsupportedLanguageError,
  isSupportedLanguage,
  normalizeLanguage,
  translateWarning
};
