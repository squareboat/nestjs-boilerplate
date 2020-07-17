import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';

const baseUrl = './dist';
register({
    baseUrl,
    paths: compilerOptions.paths,
});