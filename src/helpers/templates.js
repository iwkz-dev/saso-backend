module.exports = {
  changePasswordTemplate(email, token) {
    return {
      from: 'noreply@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Reset Password</title>
  <style>
    body {
      margin: 0;
      background-color: #F5F7F9;
      font-family: Arial, Helvetica, sans-serif;
      color: #444;
    }
    .wrapper {
      width: 100%;
      padding: 40px 0;
    }
    .container {
      max-width: 570px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #E7EAEC;
    }
    .header {
      text-align: center;
      padding: 24px;
      font-weight: bold;
      font-size: 16px;
      color: #555;
      background-color: #F9FAFB;
    }
    .content {
      padding: 35px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #292E31;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
      color: #555;
    }
    .button {
      display: inline-block;
      padding: 14px 26px;
      background-color: #414EF9;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-size: 15px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #999;
      background-color: #F9FAFB;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        Indonesischer Weisheits- & Kulturzentrum e.V · Berlin
      </div>
      <div class="content">
        <h1>Password Reset Request</h1>
        <p>
          A request was received to reset the password associated with this email address.
        </p>
        <p>
          Click the button below to create a new password. This link is valid for 24 hours.
        </p>
        <p style="text-align:center;">
          <a
            href="${process.env.PROD_API_URL}/change-password?token=${token}&email=${email}"
            class="button"
          >
            Change Password
          </a>
        </p>
        <p>
          If this request was not made, the message may be safely ignored.
        </p>
        <p>
          Regards,<br />
          <strong>IWKZ e.V</strong>
        </p>
      </div>
      <div class="footer">
        © Indonesischer Weisheits- & Kulturzentrum e.V
      </div>
    </div>
  </div>
</body>
</html>
    `,
    };
  },
  verificationEmailTemplate(email, token) {
    return {
      from: 'noreply@gmail.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      background-color: #F5F7F9;
      font-family: Arial, Helvetica, sans-serif;
      color: #444;
    }
    .wrapper {
      width: 100%;
      padding: 40px 0;
    }
    .container {
      max-width: 570px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #E7EAEC;
    }
    .header {
      text-align: center;
      padding: 24px;
      font-weight: bold;
      font-size: 16px;
      color: #555;
      background-color: #F9FAFB;
    }
    .content {
      padding: 35px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #292E31;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
      color: #555;
    }
    .button {
      display: inline-block;
      padding: 14px 26px;
      background-color: #28DB67;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-size: 15px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #999;
      background-color: #F9FAFB;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        Indonesischer Weisheits- & Kulturzentrum e.V · Berlin
      </div>
      <div class="content">
        <h1>Verify Your Email Address</h1>
        <p>
          Thank you for creating an account. Please verify your email address to activate the account.
        </p>
        <p>
          Click the button below to complete the verification process.
        </p>
        <p style="text-align:center;">
          <a
            href="${process.env.PROD_API_URL}/verify-email/${token}"
            class="button"
          >
            Verify Email
          </a>
        </p>
        <p>
          If this account was not created intentionally, the message may be ignored.
        </p>
        <p>
          Regards,<br />
          <strong>IWKZ e.V</strong>
        </p>
      </div>
      <div class="footer">
        © Indonesischer Weisheits- & Kulturzentrum e.V
      </div>
    </div>
  </div>
</body>
</html>
    `,
    };
  },
  welcomeEmailTemplate(email, name) {
    return {
      from: 'noreply@gmail.com',
      to: email,
      subject: 'Welcome to IWKZ e.V',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Welcome</title>
  <style>
    body {
      margin: 0;
      background-color: #F5F7F9;
      font-family: Arial, Helvetica, sans-serif;
      color: #444;
    }
    .wrapper {
      width: 100%;
      padding: 40px 0;
    }
    .container {
      max-width: 570px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #E7EAEC;
    }
    .header {
      text-align: center;
      padding: 24px;
      font-weight: bold;
      font-size: 16px;
      color: #555;
      background-color: #F9FAFB;
    }
    .content {
      padding: 35px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #292E31;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
      color: #555;
    }
    .highlight {
      color: #414EF9;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #999;
      background-color: #F9FAFB;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        Indonesischer Weisheits- & Kulturzentrum e.V · Berlin
      </div>
      <div class="content">
        <h1>Welcome, ${name}!</h1>
        <p>
          Thank you for joining <span class="highlight">Indonesischer Weisheits- & Kulturzentrum e.V</span>.
        </p>
        <p>
          The account has been created successfully. A wide range of cultural programs, events,
          and community activities are now accessible.
        </p>
        <p>
          If there are any questions or assistance is required, please feel free to reach out.
        </p>
        <p>
          Warm regards,<br />
          <strong>IWKZ e.V</strong>
        </p>
      </div>
      <div class="footer">
        © Indonesischer Weisheits- & Kulturzentrum e.V
      </div>
    </div>
  </div>
</body>
</html>
    `,
    };
  },
  resetPasswordSuccessTemplate(email, name) {
    return {
      from: 'noreply@gmail.com',
      to: email,
      subject: 'Your Password Has Been Reset',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Password Reset Successful</title>
  <style>
    body {
      margin: 0;
      background-color: #F5F7F9;
      font-family: Arial, Helvetica, sans-serif;
      color: #444;
    }
    .wrapper {
      width: 100%;
      padding: 40px 0;
    }
    .container {
      max-width: 570px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #E7EAEC;
    }
    .header {
      text-align: center;
      padding: 24px;
      font-weight: bold;
      font-size: 16px;
      color: #555;
      background-color: #F9FAFB;
    }
    .content {
      padding: 35px;
    }
    h1 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #292E31;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
      color: #555;
    }
    .highlight {
      color: #414EF9;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #999;
      background-color: #F9FAFB;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        Indonesischer Weisheits- & Kulturzentrum e.V · Berlin
      </div>
      <div class="content">
        <h1>Password Reset Successful</h1>
        <p>
          Hello <span class="highlight">${name}</span>,
        </p>
        <p>
          Your password has been successfully reset. You can now log in using your new password.
        </p>
        <p>
          If you did not request this change, please contact our support immediately.
        </p>
        <p>
          Warm regards,<br />
          <strong>IWKZ e.V</strong>
        </p>
      </div>
      <div class="footer">
        © Indonesischer Weisheits- & Kulturzentrum e.V
      </div>
    </div>
  </div>
</body>
</html>
    `,
    };
  },

  invoiceTemplate(data) {
    const toDate = (v) => (v ? new Date(v) : null);
    const dateOpts = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const fmtDate = (d) =>
      d ? d.toLocaleDateString(undefined, dateOpts) : '—';
    const fmtCurrency = (n) =>
      new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(n || 0);

    // Dates
    const createdAtStr = fmtDate(toDate(data?.created_at));
    const eventDateStr = fmtDate(toDate(data?.eventData?.started_at));

    // Status map
    const statusMap = {
      0: { text: 'Not Paid', color: '#1b1b1b' },
      1: { text: 'Paid', color: '#1F51FF' },
      2: { text: 'Cancelled', color: '#C70039' },
      3: { text: 'Done', color: '#228b22' },
    };
    const st = statusMap[data?.status ?? 0];

    // Items rows
    const rows = (data?.menus || [])
      .map((m) => {
        const qty = m?.totalPortion || 0;
        const price = m?.price || 0;
        const subtotal = qty * price;
        const img = m?.images?.[0]?.imageUrl
          ? m.images[0].imageUrl
          : 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png';

        return `
    <tr>
      <td style="padding:8px 0;border-top:1px solid #eee;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <!-- Thumb -->
            <td width="56" valign="top" style="padding-right:12px;">
              ${
                img
                  ? `<img src="${img}" width="56" height="56"
                          style="display:block;border:1px solid #eee;border-radius:10px;background:#f5f5f5;object-fit:cover;"
                          alt="Item"/>`
                  : ''
              }
            </td>

            <!-- Name (flex) -->
            <td width="292" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;">
              <strong style="line-height:1.3;display:block;">${
                m?.name || '-'
              }</strong>
            </td>

            <!-- Qty -->
            <td width="40" align="right" valign="middle"
                style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;white-space:nowrap;">
              ${qty}
            </td>

            <!-- Unit -->
            <td width="90" align="right" valign="middle"
                style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;white-space:nowrap;">
              ${fmtCurrency(price)}
            </td>

            <!-- Subtotal -->
            <td width="100" align="right" valign="middle"
                style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;white-space:nowrap;">
              <strong>${fmtCurrency(subtotal)}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
      })
      .join('');

    // Bank block (for transfer)
    const isTransfer = `
      <tr>
        <td style="padding:16px;border:1px solid #eee;border-radius:8px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td colspan="2" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#333;padding-bottom:8px;">
                <strong>Bank / PayPal Transfer Details</strong>
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666;padding:4px 0;width:140px;">IBAN</td>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;padding:4px 0;">
                <strong>${data?.eventData?.iban || '—'}</strong>
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666;padding:4px 0;">BIC</td>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;padding:4px 0;">
                <strong>${data?.eventData?.bic || '—'}</strong>
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666;padding:4px 0;">Bank Name</td>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;padding:4px 0;">
                <strong>${data?.eventData?.bankName || '—'}</strong>
              </td>
            </tr>

            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666;padding:4px 0;">Paypal</td>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;padding:4px 0;">
                <strong>${data?.eventData?.paypal || '—'}</strong>
              </td>
            </tr>

            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666;padding:4px 0;">Usage Note</td>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;padding:4px 0;">
                ${data?.eventData?.usageNote || ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;

    // Pre-order note by status
    let preorderNote;
    if (data?.status === 2) {
      preorderNote = 'Order cancelled.';
    } else if (data?.status === 1 || data?.status === 3) {
      preorderNote = 'Payment received — your pre-order is confirmed.';
    } else {
      preorderNote =
        data.paymentType?.note ||
        'This is a pre-order. Please complete payment to confirm your order.';
    }

    // QR
    const qrImg = data?.qrcodeImg
      ? `<img src="${data.qrcodeImg}" width="120" height="120" style="display:block;border:1px solid #eee;border-radius:6px;" alt="QR code"/>`
      : '';

    // --- HTML (email-safe)
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Invoice ${data?.invoiceNumber || ''}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f6f7f9;">
  <!-- Preheader (hidden in most clients) -->
  <div style="display:none;font-size:1px;color:#f6f7f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Invoice ${data?.invoiceNumber || ''} • ${preorderNote}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f6f7f9;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #eee;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1b1b1b;font-weight:bold;">
                    Indonesischer Weisheits- &amp; Kulturzentrum e.V. <span style="display:block;color:#666;font-weight:normal;font-size:14px;">Berlin</span>
                    <div style="color:#666;font-size:13px;margin-top:6px;">Feldzeugmeisterstr. 1<br/>10557 Berlin</div>
                  </td>
                  <td valign="top" align="right" style="font-family:Arial,Helvetica,sans-serif;">
                    <div style="font-size:22px;font-weight:800;color:#1b1b1b;line-height:1.2;">Invoice</div>
                    <div style="margin-top:8px;display:inline-block;border:1px solid ${
                      st.color
                    };color:${
      st.color
    };border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700;">
                      ${st.text}
                    </div>
                    <div style="color:#666;font-size:13px;margin-top:8px;">${createdAtStr}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meta -->
          <tr>
            <td style="padding:18px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <!-- Invoice details -->
                  <td valign="top" width="50%" style="padding-right:10px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eee;border-radius:8px;">
                      <tr>
                        <td style="padding:12px 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#333;"><strong>Invoice Details</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:0 14px 12px;">
                          <table role="presentation" width="100%">
                            <tr>
                              <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;padding:4px 0;">Invoice No.</td>
                              <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;padding:4px 0;"><strong>${
                                data?.invoiceNumber || '—'
                              }</strong></td>
                            </tr>
                            <tr>
                              <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;padding:4px 0;">Payment Method</td>
                              <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;padding:4px 0;"><strong>${(
                                data?.paymentType.name || ''
                              ).toUpperCase()}</strong></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Bill to -->
                  <td valign="top" width="50%" style="padding-left:10px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eee;border-radius:8px;">
                      <tr>
                        <td style="padding:12px 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#333;"><strong>Bill To</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:0 14px 12px;font-family:Arial,Helvetica,sans-serif;color:#1b1b1b;">
                          <div style="font-size:14px;"><strong>${
                            data?.customerFullname || '—'
                          }</strong></div>
                          <div style="font-size:13px;color:#666;margin-top:2px;">${
                            data?.customerEmail || ''
                          }</div>
                          <div style="font-size:13px;color:#666;margin-top:2px;">${
                            data?.customerPhone || ''
                          }</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
<tr>
  <td style="padding:0 24px 8px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eee;border-radius:8px;">
      <tr>
        <td style="padding:12px 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#333;">
          <strong>Order Items (Pre-Order)</strong>
        </td>
      </tr>

      <!-- Column header with fixed widths -->
      <tr>
        <td style="padding:0 14px 6px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <!-- 348px = 56 (thumb) + 12 (gap) + 280 (name) -->
              <td width="348" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.06em;padding:6px 0;">Item</td>
              <td width="40"  align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.06em;padding:6px 0;white-space:nowrap;">Qty</td>
              <td width="90"  align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.06em;padding:6px 0;white-space:nowrap;">Unit Price</td>
              <td width="100" align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.06em;padding:6px 0;white-space:nowrap;">Subtotal</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Item rows injected here -->
      <tr>
        <td style="padding:0 14px 10px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${rows}
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>
          <!-- Totals -->
          <tr>
            <td style="padding:8px 24px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;padding-right:12px;">
                    ${preorderNote}
                  </td>
                  <td valign="top" align="right" style="width:300px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eee;border-radius:8px;">
                      <tr>
                        <td style="padding:10px 14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;">Payment Method</td>
                        <td align="right" style="padding:10px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;"><strong>${(
                          data?.paymentType.name || ''
                        ).toUpperCase()}</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:10px 14px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;">Total</td>
                        <td align="right" style="padding:10px 14px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:18px;color:#1b1b1b;"><strong>${fmtCurrency(
                          data?.totalPrice
                        )}</strong></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bank -->
          <tr>
            <td style="padding:16px 24px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${isTransfer}
              </table>
            </td>
          </tr>

          <!-- Event -->
          <tr>
            <td style="padding:16px 24px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eee;border-radius:8px;">
                <tr>
                  <td style="padding:12px 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#333;">
                    <strong>Event</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 14px 12px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;width:140px;">Name</td>
                        <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;">
                          <strong>${data?.eventData?.name || '—'}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;">Date</td>
                        <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1b1b1b;">
                          ${eventDateStr}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- QR (Centered & Large) -->
          <tr>
            <td align="center" style="padding:20px 24px 28px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;margin-bottom:10px;">
                Scan for ticket verification
              </div>
              ${qrImg.replace(
                '<img',
                '<img width="200" style="display:block;width:200px;max-width:100%;height:auto;border-radius:8px;"'
              )}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:14px 24px 24px;border-top:1px dashed #e6e6e6;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666;">
                    Thank you for your pre-order.
                  </td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999;">
                    Invoice ${data?.invoiceNumber || ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  },
};
