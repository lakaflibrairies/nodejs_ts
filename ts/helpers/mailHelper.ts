import env from "../env";
const nodemailer = require("nodemailer");

function mail() {
  const { mailConfig } = env;

  if (!mailConfig) {
    throw new Error("No provided mail configuration.");
  }

  const servicesList: string[] = ["gmail", "yahoo", "outlook"];
  var transporter;
  const { emailSender, emailPassword, emailService, emailPort, emailHost } =
    mailConfig;

  if (servicesList.indexOf(emailService) !== -1) {
    transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailSender,
        pass: emailPassword,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      auth: {
        user: emailSender,
        pass: emailPassword,
      },
    });
  }

  let options = {
    from: emailSender,
  };

  let obj = {
    to: (receiver) => {
      options["to"] = receiver;
      return obj;
    },
    subject: (value) => {
      options["subject"] = value;
      return obj;
    },
    textContent: (value) => {
      options["text"] = value;
      return obj;
    },
    htmlContent: (value) => {
      options["html"] = value;
      return obj;
    },
    send: (cb: Function) => {
      transporter.sendMail(options, cb);
    },
  };

  return obj;
}

export default mail;
