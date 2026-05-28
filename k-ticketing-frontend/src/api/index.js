import { CONFIG } from '../config';
import * as realApi from './real';
import * as mockApi from '../mock/api';

// Uniform wrapper executing structural code switching
export const API = CONFIG.USE_MOCK ? mockApi : realApi;