import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

interface ReservationEmailData {
  submitterEmail: string
  submitterName: string
  eventName: string
  eventDate: string
  requestedSpace: string
  reservationId: string
}

export async function sendSubmissionConfirmation(data: ReservationEmailData) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.submitterEmail,
    subject: `Space Reservation Submitted – ${data.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #006633; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Chicago State University</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Office of Meetings &amp; Events</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Dear ${data.submitterName},</p>
          <p>Your space reservation request has been submitted and is now in review.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Event:</td><td>${data.eventName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date:</td><td>${data.eventDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Space Requested:</td><td>${data.requestedSpace}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Reference #:</td><td>${data.reservationId}</td></tr>
          </table>
          <p>You will receive email updates as your request moves through the approval process.</p>
          <p style="color: #6b7280; font-size: 13px;">Office of Meetings &amp; Events | 9501 South King Drive – Room 2304 | Chicago, IL 60628 | (773) 821-2183</p>
        </div>
      </div>
    `,
  })
}

export async function sendApprovalNotification(
  data: ReservationEmailData & { approverName: string; notes?: string }
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.submitterEmail,
    subject: `Space Reservation Approved – ${data.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #006633; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Chicago State University</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Office of Meetings &amp; Events</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
          <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 12px; margin-bottom: 16px;">
            <strong>✅ Your reservation has been APPROVED</strong>
          </div>
          <p>Dear ${data.submitterName},</p>
          <p>Your space reservation request for <strong>${data.eventName}</strong> has been approved.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Event:</td><td>${data.eventName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date:</td><td>${data.eventDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Space:</td><td>${data.requestedSpace}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Reference #:</td><td>${data.reservationId}</td></tr>
          </table>
          ${data.notes ? `<p><strong>Notes from Coordinator:</strong> ${data.notes}</p>` : ""}
          <p>Please retain this email as your authorization to use the space. Campus Police will be notified.</p>
          <p style="color: #6b7280; font-size: 13px;">Office of Meetings &amp; Events | 9501 South King Drive – Room 2304 | (773) 821-2183</p>
        </div>
      </div>
    `,
  })
}

export async function sendDenialNotification(
  data: ReservationEmailData & { reason: string }
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.submitterEmail,
    subject: `Space Reservation Not Approved – ${data.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #006633; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Chicago State University</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Office of Meetings &amp; Events</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
          <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin-bottom: 16px;">
            <strong>❌ Your reservation was NOT approved</strong>
          </div>
          <p>Dear ${data.submitterName},</p>
          <p>Unfortunately, your space reservation request for <strong>${data.eventName}</strong> was not approved.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Event:</td><td>${data.eventName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date:</td><td>${data.eventDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Space Requested:</td><td>${data.requestedSpace}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Reference #:</td><td>${data.reservationId}</td></tr>
          </table>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p>If you have questions, contact the Office of Meetings &amp; Events at (773) 821-2183 or Room 2304.</p>
          <p style="color: #6b7280; font-size: 13px;">Office of Meetings &amp; Events | 9501 South King Drive – Room 2304 | (773) 821-2183</p>
        </div>
      </div>
    `,
  })
}

export async function sendPoliceNotification(
  data: ReservationEmailData & {
    policeEmail: string
    startTime: string
    endTime: string
    doorOpenTimeSponsor?: string
    doorOpenTimePublic?: string
    attendance: number
    submitterType: string
  }
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.policeEmail,
    subject: `Approved Event Notification – ${data.eventDate} – ${data.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e3a5f; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Chicago State University</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Campus Police – Event Notification</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
          <p>The following event has been approved and requires your attention:</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr style="background-color: #f9fafb;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Event</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.eventName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Location</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.requestedSpace}</td></tr>
            <tr style="background-color: #f9fafb;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Date</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.eventDate}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Event Time</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.startTime} – ${data.endTime}</td></tr>
            ${data.doorOpenTimeSponsor ? `<tr style="background-color: #f9fafb;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Door Open (Sponsor)</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.doorOpenTimeSponsor}</td></tr>` : ""}
            ${data.doorOpenTimePublic ? `<tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Door Open (Public)</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.doorOpenTimePublic}</td></tr>` : ""}
            <tr style="background-color: #f9fafb;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Expected Attendance</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.attendance}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Authorized By</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.submitterName} (${data.submitterType})</td></tr>
            <tr style="background-color: #f9fafb;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Contact</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.submitterEmail}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Reference #</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${data.reservationId}</td></tr>
          </table>
          <p>Please ensure the room is accessible at the specified time.</p>
        </div>
      </div>
    `,
  })
}

export async function sendAdvisorNotification(
  advisorEmail: string,
  data: ReservationEmailData
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: advisorEmail,
    subject: `Action Required: Space Reservation – ${data.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #006633; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">Chicago State University</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Office of Meetings &amp; Events</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
          <p>A student organization space reservation requires your approval:</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Event:</td><td>${data.eventName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Date:</td><td>${data.eventDate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Space:</td><td>${data.requestedSpace}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Submitted By:</td><td>${data.submitterName}</td></tr>
          </table>
          <p>Please log in to the CSU Space Reservation system to review and approve this request.</p>
          <p style="color: #6b7280; font-size: 13px;">Office of Meetings &amp; Events | 9501 South King Drive – Room 2304 | (773) 821-2183</p>
        </div>
      </div>
    `,
  })
}
