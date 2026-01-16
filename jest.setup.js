/* eslint-disable @typescript-eslint/no-require-imports */
// TextEncoder/TextDecoder のポリフィル
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// @testing-library/jest-dom のマッチャーを追加
require('@testing-library/jest-dom');
