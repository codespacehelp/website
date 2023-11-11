// Called when a form is submitted.
import * as AWS from "aws-sdk";

function generateICS(date, time, title, location) {
  const startTime = time.split('-')[0].trim().replace(':', '');
  const endTime = time.split('-')[1].trim().replace(':', '');

  let ics = 'BEGIN:VCALENDAR';
  ics += '\nVERSION:2.0';
  ics += '\nBEGIN:VEVENT';
  ics += `\nDTSTART;TZID=Europe/Brussels:${date}T${startTime}00`;
  ics += `\nDTEND;TZID=Europe/Brussels:${date}T${endTime}00`;
  ics += `\nSUMMARY:${title}`;
  ics += `\nLOCATION:${location}`;
  ics += '\nEND:VEVENT';
  ics += '\nEND:VCALENDAR';
  return ics;
}

export const handler = async (event, _) => {
  // Get the request body from the context
  let form = JSON.parse(event.body);

  // console.log(form);
  let formData = form.payload.data;
  let name = formData.name
  let email = formData.email
  let workshopTitle = formData.workshop_title
  let workshopDate = formData.workshop_date
  let workshopTime = formData.workshop_time
  let workshopRoom = formData.workshop_room
  // let question = form.payloed.data.question


  AWS.config.update({
    accessKeyId: process.env["AWS_SES_ACCESS_KEY_ID"],
    secretAccessKey: process.env["AWS_SES_SECRET_ACCESS_KEY"],
    region: process.env["AWS_SES_REGION"]
  });
  const ses = new AWS.SES({ apiVersion: "2010-12-01" })

  const mimeBoundary = `----MIME-BOUNDARY-${Date.now().toString(16)}----`
  const mimeHeaders = [
    'MIME-Version: 1.0',
    `From: Code Space <info@codespace.help>`,
    `To: ${name} <${email}>`,
    `Subject: ${workshopTitle} Calendar Invite`,
    `Content-Type: multipart/mixed; boundary="${mimeBoundary}"`,
  ].join('\r\n')
  const textPart = [
    `--${mimeBoundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    `Thank you for registering for ${workshopTitle}! Please find the calendar invite attached to this email.`,
    '',
    'Best,',
    'Team Code Space',
    '',
  ].join('\r\n')
  const attachmentPart = [
    `--${mimeBoundary}`,
    'Content-Type: text/calendar; charset=UTF-8; method=REQUEST',
    'Content-Transfer-Encoding: 7bit',
    'Content-Disposition: attachment; filename="invite.ics"',
    '',
    generateICS(workshopDate, workshopTime, workshopTitle, workshopRoom),
    '',
  ].join('\r\n')
  const endBoundary = `--${mimeBoundary}--`
  const mimeMessage = [mimeHeaders, textPart, attachmentPart, endBoundary].join('\r\n\r\n')
  // const rawMessage = Buffer.from(mimeMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const emailParams = {
    RawMessage: { Data: mimeMessage },
    Destinations: [email],
    Source: 'info@codespace.help'
  }

  try {
    const data = await ses.sendRawEmail(emailParams).promise();
    console.log(`Email submitted to SES`, data);
    return { statusCode: 302, headers: { Location: '/workshop-registered' }, body: `Message sent to ${email}` }
  } catch (error) {
    return { statusCode: 500, body: `Message not sent, error ${error}` }
  }
};
