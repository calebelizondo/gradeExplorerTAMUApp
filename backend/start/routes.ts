/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

router.get('/', async (ctx: any) => {
  return ctx.response.status(201).json({
    message: "Hello World!"
  })
});
