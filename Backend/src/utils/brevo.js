import brevo from "@getbrevo/brevo";

const templates = {
  welcome: 6,
  sellerRegistration: 7,
  resetPassword: 8,
  customerOrderDelivered: 9,
  customerOrderPlaced: 10,
  sellerOrderReceived: 11,
  markUserAsAdmin: 12,
  unmarkUserAsAdmin: 13,
  customerFeedback: 14,
};

const brevoConfig = () => {
  let defaultClient = brevo.ApiClient.instance;

  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
};

const addToContactList = (email, username) => {
  let apiInstance = new brevo.ContactsApi();

  let createContact = new brevo.CreateContact();
  createContact.email = email;
  createContact.listIds = [2];

  apiInstance
    .createContact(createContact)
    .then(() => {
      console.log("Added to contact list successfully.");
      sendTemplateEmail({
        to: email,
        subject: "Welcome to GadgetGrove !!",
        params: {
          name: username,
          loginUrl: process.env.HOST_URL + "/login",
          productsUrl: process.env.HOST_URL + "/products",
        },
        templateId: templates.welcome,
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendTemplateEmail = (emailBody) => {
  const { to, subject, params, templateId } = emailBody;

  let apiInstance = new brevo.TransactionalEmailsApi();
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = {
    name: process.env.BREVO_FROM_NAME,
    email: process.env.BREVO_FROM_EMAIL,
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.params = params;
  sendSmtpEmail.templateId = templateId;

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
};

export { brevoConfig, sendTemplateEmail, addToContactList, templates };

// sendTestEmail.emailTo = ["sahil@yopmail.com"];
// sendTestEmail.params = {
//   name: "mother",
//   subject: "test subject",
// };
