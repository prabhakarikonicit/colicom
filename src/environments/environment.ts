// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  VERSION: '1.7.0',
  API_BASE_PATH: 'https://app.compucram.com/api', // 'https://s-app.compucram.com/api'; // Prod
  // API_BASE_PATH: 'https://php-tpc.compucram.com/public/index.php', // 'https://s-app.compucram.com/api'; // Dev
  MARKETING_SITE: 'http://www.compucram.com',
  MARKETING_SITE_EXTENSIONS: 'http://www.compucram.com/exam-prep/extensions.html',
  MARKETING_SUPPORT_SITE: 'http://www.compucram.com/support',
  SAVE_EVERY_QUESTIONS: 5,
  AUDIO_URL: 'http://app.compucram.com/assets/audio/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
