import 'zone.js/dist/zone-node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as expressUserAgent from 'express-useragent';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/personal-resume/browser');
  const indexHtml = fs.existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.use(cors({origin: "*" }));
  server.use(bodyParser.json());

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', (filePath: string, options: any, callback: any) => {
    const source = options.req.headers['user-agent'];
    const userAgent = expressUserAgent.parse(source);

    return ngExpressEngine({
      bootstrap: AppServerModule,
      providers: [
        { provide: 'url', useValue: options.req.protocol + '://' + options.req.get('host') + options.req.originalUrl },
        { provide: 'isMobile', useValue: userAgent.isMobile }
      ]
    })(filePath, options, callback);
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/download-cv', (_req, res) => {
    const cvFolder = join(process.cwd(), 'public/pdf');
    res.download(join(cvFolder, 'CV - Astrit Demiri.pdf'));
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  server.post('/send-email', (req, res) => {
    let body = req.body;
    const transporter = nodemailer.createTransport({
      host: process.env["EMAIL_HOST"],
      port:  Number(process.env["EMAIL_PORT"]),
      secure: true,
      auth: {
        user: process.env["EMAIL_AUTH_USER"],
        pass: process.env["EMAIL_AUTH_PASS"],
      },
    });

    const mailOptions = {
      from: process.env["EMAIL_FROM"],
      to: process.env["EMAIL_TO"],
      subject: body.subject,
      html: `${body.name} ${body.email} <hr> ${body.message}`
    };

    transporter.sendMail(mailOptions, (error, _info) => {
      if (error) {
        return res.json({ sent: false, message: "Failed to send email!" });
      }

      return res.json({ sent: true, message: "Email sent successfully!" });
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
