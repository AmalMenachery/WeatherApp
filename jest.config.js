/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  // setting testEnvironment to jsdom inorder to detect open handles
  testEnvironment: 'jsdom',
  // limiting the worker memory limit, workaround for https://github.com/jestjs/jest/issues/11956
  // keeping this as a fallback, since `--expose-gc --no-compilation-cache` (in the package.json test script) seems to be more effective
  workerIdleMemoryLimit: '1GB',
  coveragePathIgnorePatterns: ['<rootDir>/modifiedModules/'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@react-native|react-native|react-clone-referenced-element|@react-native-community|react-navigation|@react-navigation/.*|@unimodules/.*)',
  ],
  setupFiles: ['./setup.jest.js'],
  testPathIgnorePatterns: ['<rootDir>/modifiedModules/'],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['js', 'ios.js', 'jsx', 'ts', 'ios.ts', 'tsx', 'json', 'node', 'ios.svg', 'android.svg', 'svg'],
  moduleNameMapper: {
    // Force CommonJS build for http adapter to be available.
    // via https://github.com/axios/axios/issues/5101#issuecomment-1276572468
    '^axios$': require.resolve('axios'),
  },
  reporters: ['default', ['jest-junit', { outputDirectory: 'test-reports', outputName: 'test-report.xml' }]],
};
