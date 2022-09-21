function generateBodyMenu(data) {
  let body = ``;

  data.forEach((el) => {
    body += `
    <tr>
      <td style="padding-top: 0;">
        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0"
          class="devicewidthinner" style="border-bottom: 1px solid #eeeeee;"
        >
          <tbody>
            <tr>
              <td rowspan="4" style="padding-right: 10px; padding-bottom: 10px;">
                <img style="height: 80px; width: 85px" src="${
                  el.images.length > 0
                    ? el.images[0].imageUrl
                    : `https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png`
                }"
                    alt="Product Image" />
              </td>
              <td colspan="2"
                  style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                  ${el.name}
              </td>
            </tr>
            <tr>
              <td
                  style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                  Quantity: ${el.totalPortion}
              </td>
              <td style="width: 130px;"></td>
            </tr>
            <tr>
              <td style="font-size: 14px; line-height: 18px; color: #757575;">
              </td>
              <td
                  style="font-size: 14px; line-height: 18px; color: #757575; text-align: right;">
                  € ${el.price.toLocaleString("de-DE")} Per Item
              </td>
            </tr>
            <tr>
              <td
                  style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
              </td>
              <td
                  style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                  <b style="color: #666666;">€ ${(
                    el.price * el.totalPortion
                  ).toLocaleString("de-DE")}</b> Total
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    `;
  });
  return body;
}
module.exports = {
  changePasswordTemplate: function (email, token) {
    return {
      from: "noreply@gmail.com",
      to: `${email}`,
      subject: "Change Password",
      html: `
  
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Verify your email address</title>
    <style type="text/css" rel="stylesheet" media="all">
      /* Base ------------------------------ */
      *:not(br):not(tr):not(html) {
        font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        line-height: 1.4;
        background-color: #F5F7F9;
        color: #839197;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #f15447;
        font-weight: bold;
      }
  
      /* Layout ------------------------------ */
      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #F5F7F9;
      }
      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
      }
  
      /* Masthead ----------------------- */
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }
      .email-masthead_logo {
        max-width: 400px;
        border: 0;
      }
      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: #839197;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
  
      /* Body ------------------------------ */
      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
        border-top: 1px solid #E7EAEC;
        border-bottom: 1px solid #E7EAEC;
        background-color: #FFFFFF;
      }
      .email-body_inner {
        width: 570px;
        margin: 0 auto;
        padding: 0;
      }
      .email-footer {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        text-align: center;
      }
      .email-footer p {
        color: #839197;
      }
      .body-action {
        width: 100%;
        margin: 30px auto;
        padding: 0;
        text-align: center;
      }
      .body-sub {
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px solid #E7EAEC;
      }
      .content-cell {
        padding: 35px;
      }
      .align-right {
        text-align: right;
      }
  
      /* Type ------------------------------ */
      h1 {
        margin-top: 0;
        color: #292E31;
        font-size: 19px;
        font-weight: bold;
        text-align: left;
      }
      h2 {
        margin-top: 0;
        color: #292E31;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }
      h3 {
        margin-top: 0;
        color: #292E31;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }
      p {
        margin-top: 0;
        color: #839197;
        font-size: 16px;
        line-height: 1.5em;
        text-align: left;
      }
      p.sub {
        font-size: 12px;
      }
      p.center {
        text-align: center;
      }
  
      /* Buttons ------------------------------ */
      .button {
        display: inline-block;
        width: 200px;
        background-color: #414EF9;
        border-radius: 3px;
        color: #ffffff;
        font-size: 15px;
        line-height: 45px;
        text-align: center;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        mso-hide: all;
      }
      .button--green {
        background-color: #28DB67;
      }
      .button--red {
        background-color: #FF3665;
      }
      .button--blue {
        background-color: #F0E5CF;
      }
  
      /*Media Queries ------------------------------ */
      @media only screen and (max-width: 600px) {
        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }
      }
      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
            <!-- Logo -->
            <tr>
              <td class="email-masthead">
                Indonesischer Weisheits- & Kulturzentrum e.V. <span>Berlin</span>
              </td>
            </tr>
            <!-- Email Body -->
            <tr>
              <td class="email-body" width="100%">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell">
                      <h1>Forgot your password?</h1>
                      <p>We received a request to change the password for your account</p>
                      <p>To change your password, click on the button below</p>
                      <!-- Action -->
                      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <div>
                              <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{action_url}}" style="height:45px;v-text-anchor:middle;width:200px;" arcsize="7%" stroke="f" fill="t">
                              <v:fill type="tile" color="#414EF9" />
                              <w:anchorlock/>
                              <center style="color:#ffffff;font-family:sans-serif;font-size:15px;">Verify Email</center>
                            </v:roundrect><![endif]-->
                            <a href='https://saso.iwkz.de/change-password/${token}' class="button button--blue">Change Password</a>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <p>Thank You,<br>IWKZ e.V</p>
                      <!-- Sub copy -->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-cell">
                      <p class="sub center">
                      &#169; Indonesischer Weisheits- & Kulturzentrum e.V
                      </p>
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
  `,
    };
  },

  invoiceTemplate: function (data) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    let dateLocalCreatedAt = data.created_at.toLocaleDateString(
      undefined,
      options
    );
    let statusString = "";
    if (data.status === 0) {
      statusString = "Not Paid";
    }

    if (data.status === 1) {
      statusString = "Paid";
    }

    if (data.status === 2) {
      statusString = "Cancelled";
    }

    if (data.status === 3) {
      statusString = "Done";
    }
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Your Order</title>

    <!-- Start Common CSS -->
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        body {
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
            font-family: Helvetica, arial, sans-serif;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        .backgroundTable {
            margin: 0;
            padding: 0;
            width: 100% !important;
            line-height: 100% !important;
        }

        .main-temp table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            font-family: Helvetica, arial, sans-serif;
        }

        .main-temp table td {
            border-collapse: collapse;
        }
    </style>
    <!-- End Common CSS -->
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="backgroundTable main-temp"
        style="">
        <tbody>
            <tr>
                <td>
                    <table width="600" align="center" cellpadding="15" cellspacing="0" border="0" class="devicewidth"
                        style="background-color: #ffffff;">
                        <tbody>
                            <!-- Start header Section -->
                            <tr>
                                <td style="padding-top: 30px;">
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0"
                                        class="devicewidthinner"
                                        style="border-bottom: 1px solid #eeeeee; text-align: center;">
                                        <tbody>
                                            <tr>
                                                <td style="font-weight: 700;">
                                                    Indonesischer Weisheits- & Kulturzentrum e.V. <span>Berlin</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                    Feldzeugmeister. 1

                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px;">
                                                    10557 Berlin

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- End header Section -->

                            <!-- Start address Section -->
                            <tr>
                                <td style="padding-top: 0;">
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0"
                                        class="devicewidthinner" style="border-bottom: 1px solid #bbbbbb;">
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="width: 55%; font-size: 16px; font-weight: bold; color: #1b1b1b; padding-bottom: 5px;">
                                                    Invoice Number
                                                </td>
                                                <td
                                                    style="width: 45%; font-size: 16px; font-weight: bold; color: #1b1b1b; padding-bottom: 5px;">
                                                    ${data.invoiceNumber}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                    Invoice Date
                                                </td>
                                                <td
                                                    style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                    ${dateLocalCreatedAt}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="width: 55%; font-size: 16px; font-weight: bold; color: #1b1b1b; padding-bottom: 5px;">
                                                    Fullname
                                                </td>
                                                <td
                                                    style="width: 45%; font-size: 16px; font-weight: bold; color: #1b1b1b; padding-bottom: 5px;">
                                                    ${data.customerFullname}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="width: 55%; font-size: 16px; font-weight: bold; color: #1b1b1b; padding-bottom: 5px;">
                                                    Customer Id
                                                </td>
                                                <td
                                                    style="width: 45%; font-size: 16px; font-weight: bold; color: #1b1b1b; padding-bottom: 5px;">
                                                    ${data.customerId.toString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- End address Section -->

                            <!-- Start product Section -->
                              ${generateBodyMenu(data.menus)}
                            <!-- End product Section -->

                            <!-- Start calculation Section -->
                            <tr>
                                <td style="padding-top: 0;">
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0"
                                        class="devicewidthinner"
                                        style="border-bottom: 1px solid #bbbbbb; margin-top: -5px;">
                                        <tbody>
                                            <tr>
                                                <td rowspan="5" style="width: 55%;"></td>

                                                <td
                                                  style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; padding-bottom: 10px;">
                                                    Total Price
                                                </td>
                                                <td
                                                  style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; padding-bottom: 10px; text-align: right;">
                                                    € ${data.totalPrice}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- End calculation Section -->

                            <!-- Start payment method Section -->
                            <tr>
                                <td style="padding: 0 10px;">
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0"
                                        class="devicewidthinner">
                                        <tbody>
                                            <tr>
                                                <td colspan="2"
                                                    style="font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                                    Payment Method (Bank Transfer)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                    Bank Name: ${
                                                      data.eventData.bankName ||
                                                      "-"
                                                    }
                                                </td>
                                                <td
                                                    style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                    Account Name: Indonesischer Weisheits- und Kulturzentrum e.V.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                    IBAN: ${
                                                      data.eventData.iban || "-"
                                                    }
                                                </td>
                                                <td
                                                    style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                    BIC: ${
                                                      data.eventData.bic || "-"
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2"
                                                  style="width: 55%; font-size: 16px; font-weight: bold; line-height: 18px; color: #666666; padding: 10px 0px;">
                                                  Payment Method (Paypal) : ${
                                                    data.eventData.paypal || "-"
                                                  }
                                                </td>
                                            </tr>
                                            <tr>
                                              <td colspan="2"
                                              style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                               Verwendungszweck : ${
                                                 data.eventData.usageNote || "-"
                                               }
                                              </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2"
                                                    style="width: 100%; text-align: center; font-style: italic; font-size: 13px; font-weight: 600; color: #666666; padding: 15px 0; border-top: 1px solid #eeeeee;">
                                                    <b style="font-size: 14px;">Note:</b> ${
                                                      data.note || "-"
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- End payment method Section -->
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
      `;
  },
};
