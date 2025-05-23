// jest.config.js
export default {
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/'
    ],
    setupFiles: ['./jest.setup.js'],

};
