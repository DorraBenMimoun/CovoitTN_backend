module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/integrations/*.test.js'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testTimeout: 30000, // Augmente le timeout global à 30 secondes
};
