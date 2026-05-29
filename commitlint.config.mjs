// commitlint.config.js
const commitlintConfig = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: 'conventional-changelog-conventionalcommits',
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // A new feature for the user or app.
                'fix',      // A bug fix for the user or app.
                'docs',     // Documentation-only changes (e.g., updating a README).
                'style',    // Changes that do not affect the meaning of the code.
                'ref',      // A code change that neither fixes a bug nor adds a feature (e.g., renaming variables, simplifying logic).
                'perf',     // A code change that improves performance.
                'test',     // Adding missing tests or correcting existing tests.
                'build',    // Changes that affect the build system or external dependencies (e.g., npm, webpack, vite).
                'ci',       // Changes to CI/CD configuration files and scripts (e.g., GitHub Actions, Travis, GitLab CI).
                'chore',    // General maintenance tasks, updating build tasks, or changes that don't modify the source code or test files.
                'revert'    // Used to revert a previous commit.
            ]
        ]
    },
};
export default commitlintConfig;
