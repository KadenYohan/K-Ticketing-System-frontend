// API index — switches between mock and real API based on CONFIG.USE_MOCK
import { CONFIG } from './config';
import * as real from './real';
import * as mock from './mock';

export const API = CONFIG.USE_MOCK ? mock : real;
