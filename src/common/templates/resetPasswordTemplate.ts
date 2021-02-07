export const RESET_PASSWORD_EMAIL_TEMPLATE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Thrivelution Verification</title>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap');

      p,
      h1,
      h2,
      h3,
      h4,
      ol,
      li,
      ul {
        font-family: 'Montserrat', sans-serif;
      }

      ody {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      .img {
        width: 100% !important;
        height: auto !important;
      }

      @media only screen and (max-width: 480px) {
        .tbl_wrap {
          width: 100% !important;
        }

        .r_t {
          padding: 15px !important;
        }

        .products td {
          text-align: center !important;
          width: 100% !important;
          display: block !important;
          text-align: center !important;
        }

        .products {
          margin-bottom: 0 !important;
        }

        .r_h {
          display: none;
        }
      }
    </style>
  </head>

  <body
    topmargin="0"
    leftmargin="0"
    rightmargin="0"
    bottommargin="0"
    marginheight="0"
    marginwidth="0"
    bgcolor="#fff"
  >
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      bgcolor="#fff"
    >
      <tr>
        <td valign="top" align="center" style="height: 10px;">&nbsp;</td>
      </tr>
      <tr>
        <td valign="top" align="center" style="padding: 0 20px;">
          <table
            width="100%"
            border="0"
            align="center"
            cellpadding="0"
            bgcolor="#ffffff"
            cellspacing="0"
            class="tbl_wrap"
          >
            <tr>
              <td valign="top" bgcolor="#fff">
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  class="tbl_header"
                >
                  <tr>
                    <td
                      width="30%"
                      valign="top"
                      class="logo"
                      style="padding: 20px 10px 0;"
                    >
                      <img
                        style="display: block;"
                        src="https://i.ibb.co/3Y4tf1m/logo-full.png"
                        alt="Thrivelution"
                        width="256"
                        height="33"
                        border="0"
                      />
                    </td>
                    <td
                      width="70%"
                      style="padding-right: 15px;"
                      class="r_h"
                      align="right"
                      valign="middle"
                    ></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td valign="top" class="r_t" style="padding: 30px 10px;">
                <table
                  width="100%"
                  border="0"
                  align="center"
                  cellpadding="0"
                  class="tbl_main"
                  cellspacing="0"
                >
                  <tr>
                    <td valign="top" align="left" style="padding: 0 0 0px 0;">
                      <p
                        style="
                          font-family: 'Montserrat', sans-serif;
                          font-size: 14px;
                          font-weight: 500;
                          color: #3e5665;
                          padding: 0;
                          margin: 0 0 20px;
                          line-height: 1.4;
                        "
                      >
                        Hi {{user_name}},
                      </p>
                      <p
                        style="
                          font-family: 'Montserrat', sans-serif;
                          font-size: 14px;
                          color: #3e5665;
                          font-weight: 500;
                          padding: 0;
                          margin: 0 0 0px;
                          line-height: 1.4;
                        "
                      >
                       A request has been received to change the password for your Thrivelution account.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      valign="top"
                      class="products r_t"
                      style="padding: 25px 0 10px;"
                    >
                      <p
                        style="
                          font-family: 'Montserrat', sans-serif;
                          font-size: 14px;
                          color: #3e5665;
                          padding: 0;
                          margin: 0 0 10px;
                          line-height: 1.4;
                        "
                      >
                        <a href="{{url}}/reset-password/{{id}}/{{code}}" target="_blank">
                          <img
                            src="https://i.ibb.co/7JVZFBF/reset-Password-Button.png"
                            alt="done-3x"
                            border="0"
                            width="200"
                            height="50"
                        /></a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" align="left" style="padding: 0 0 20px 0;">
                      <p
                        style="
                          font-family: 'Montserrat', sans-serif;
                          font-size: 14px;
                          font-weight: 500;
                          color: #3e5665;
                          padding: 0;
                          margin: 0 0 20px;
                          line-height: 1.4;
                        "
                      >
                        If you did not initiate this request, please contact us immediately at:
                      </p>
                      <p
                        style="
                          font-family: 'Montserrat', sans-serif;
                          font-size: 14px;
                          color: #3e5665;
                          font-weight: 500;
                          padding: 0;
                          margin: 0 0 0px;
                          line-height: 1.4;
                        "
                      >
                       <p style="color: #6bbcb9;font-family: 'Montserrat', sans-serif;font-size: 14px;">support@thrivelution.com</b>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" align="left" style="padding: 0 0 20px 0;">
                      <p
                        style="
                          font-family: 'Montserrat', sans-serif;
                          font-size: 14px;
                          color: #3e5665;
                          padding: 0;
                          margin: 0 0 0;
                          line-height: 1.4;
                          font-weight: 500;
                        "
                      >
                        Thank you,
                      </p>
                      <p
                        style="
                          font-family: 'Montserrat', sans-serif;
                          font-size: 14px;
                          color: #3e5665;
                          padding: 0;
                          margin: 0 0 20px;
                          line-height: 1.4;
                          font-weight: 500;
                        "
                      >
                        Thrivelution team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td valign="top" align="center" style="height: 10px;">&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;
