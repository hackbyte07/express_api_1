import { createTransport } from "nodemailer";

const transport = createTransport({
  service: "gmail",
  host: "smtp.gmail.io",
  port: 587,
  secure: false,
  auth: {
    user: "ranaaayushcreator@gmail.com",
    pass: `${process.env.gmailPass}`,
  },
});

const sendMail = async (emailId: string) => {
  try {
    const info = await transport.sendMail({
      from: {
        name: "Aayush",
        address: "ranaaayushcreator@gmail.com",
      },
      to: [emailId],
      subject: "Notes welcome you.",
      text: "hey there welcome to notes.",
    });

    console.log(info);
  } catch (error) {
    console.log('some error')
    console.error(error);
  }
};

export default sendMail;
