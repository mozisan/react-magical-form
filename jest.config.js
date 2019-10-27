module.exports = {
  setupFilesAfterEnv: ['regenerator-runtime/runtime'],
  testRegex: '\\.test\\.tsx?$',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '<rootDir>/src/**/*.tsx'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: ['/index\\.ts$', '/validators/'],
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  moduleDirectories: [
    '<rootDir>/node_modules/',
    '<rootDir>/../../node_modules/',
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transform: {
    '\\.js$': 'babel-jest',
    '\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@mozisan)/'],
  unmockedModulePathPatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/../../node_modules/',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
    },
  },
};
