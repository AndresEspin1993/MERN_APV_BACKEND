import nodemailer from "nodemailer";


const emailOlvidePassword = async (datos) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }

  
      });

    const {email, nombre, token} = datos;

    //   ENVIAR EL EMAIL

    //   const info = await transporter.sendMail({
    //     from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>' ,
    //     to: email,
    //     subject: 'Reestablece tus password',
    //     text: 'Reestablece tus password',
    //     html: `<p> Hola ${nombre}, Has solicitado restablecer tu password </p>
    //     <p>SIgue el siguiente enlace para generar un nuevo password: 
    //     <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password </a>  </p>
    //     <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje </p> `,
            
    //   });

    try {

        const info = await transporter.sendMail({
            from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>' ,
            to: email,
            subject: 'Reestablece tus password',
            text: 'Reestablece tus password',
            html: `<p> Hola ${nombre}, Has solicitado restablecer tu password </p>
            <p>SIgue el siguiente enlace para generar un nuevo password: 
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password </a>  </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje </p> `,
                
          });

          console.log(info)
        
    } catch (error) {
        console.log('error: ', error)
    }
    //   console.log("Mensaje enviado: %s ", info.messageId)
};


export default emailOlvidePassword;

