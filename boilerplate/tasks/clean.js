import gulp from 'gulp';
import del from 'del';

import cache from 'gulp-cache';

import config from '../config';

export function cleanDeleteFiles(done) {
  console.log("clean it all");
  return del([`${config.dist}/**`, `!${config.dist}`,`!${config.dist}/static`, '.sass-cache'], done);
}

export function cleanClearCache(done) {
  return cache.clearAll(done);
}
