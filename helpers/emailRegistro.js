import nodemailer from "nodemailer";


const emailRegistro = async (datos) => {
  console.log({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }


  })


    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }

  
      });

    //   console.log(datos)

    const {email, nombre, token} = datos;

    console.log(datos);
    //   ENVIAR EL EMAIL

    try {


      const info = await transporter.sendMail({

        from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>' ,
        to: email,
        subject: 'Comprueba tu cuenta APV',
        text: 'Comprueba tu cuenta APV',
        html: `<p> Hola ${nombre}, comprueba tu cuenta en APV. </p>
        <p>Tu cuenta esta lista, Solo debes comprobarla en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta </a>  </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje </p> `,
            
      });

      console.log("Mensaje enviado: %s ", info)
      
    } catch (error) {

      console.log(error);
      
    }
     
};


export default emailRegistro;

