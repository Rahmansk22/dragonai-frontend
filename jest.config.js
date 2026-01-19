module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|remark-gfm|@clerk/nextjs)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-markdown$': '<rootDir>/node_modules/react-markdown/index.js',
    '^remark-gfm$': '<rootDir>/node_modules/remark-gfm/index.js',
  },
};