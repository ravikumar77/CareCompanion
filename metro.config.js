const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'ts' and 'tsx' to the list of source extensions
config.resolver.sourceExts.push('ts', 'tsx');

// Ensure that the transformer processes all files, including those in node_modules
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;