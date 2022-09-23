import 'zone.js/dist/zone-node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as expressUserAgent from 'express-useragent';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

import { AppServerModule } from './src/main.server';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/personal-resume/browser');
  const indexHtml = fs.existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.enable('trust proxy')
  server.use(bodyParser.json());
  server.use(compression());

  server.use(function (request, response, next) {
    if (process.env['NODE_ENV'] !== 'development' && !request.secure) {
      const host = request.get('host');

      if(host && host.includes('astritdemiri')) {
        return response.redirect("https://" + request.headers.host + request.url);
      }
    }

    next();
  })

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

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/download-cv', (_req, res) => {
    const cvFolder = join(process.cwd(), 'public/pdf');
    return res.download(join(cvFolder, 'CV - Astrit Demiri.pdf'));
  });

  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  server.post('/send-email', (req, res) => {
    let body = req.body;
    const transporter = nodemailer.createTransport({
      host: process.env["EMAIL_HOST"],
      port: Number(process.env["EMAIL_PORT"]),
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

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
