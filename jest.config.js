module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,ts,tsx}"
    ],
    "setupFiles": [
        "react-app-polyfill/jsdom"
    ],
    "setupFilesAfterEnv": [
        "<rootDir>/src/setupTests.js"
    ],
    "testMatch": [
        "<rootDir>/src/**/tests/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jsdom",
    "testRunner": "jest-circus/runner.js",
    "transform": {
        "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/config/jest/babelTransform.js",
        "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$"
    ],
    "modulePaths": [],
    "moduleFileExtensions": [
        "web.js",
        "js",
        "web.ts",
        "ts",
        "web.tsx",
        "tsx",
        "json",
        "web.jsx",
        "jsx",
        "node"
    ],
    "watchPlugins": [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ],
    "resetMocks": true,
    moduleNameMapper: {
        "^react-native$": "react-native-web",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
        
        /**
        * should match webpack aliases from paths.js
        */
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@templates/(.*)$': '<rootDir>/src/templates/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@mocks/(.*)$': '<rootDir>/src/mocks/$1',
        '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
        '^@bootstrap(/.*)?$': '<rootDir>/node_modules/bootstrap/scss/bootstrap',
        
        /**
        * Mocks css imports
        */
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/config/jest/fileTransform.js",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    }
}