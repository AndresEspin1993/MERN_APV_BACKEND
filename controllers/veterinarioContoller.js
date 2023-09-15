import Veterinario from "../models/veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";



const registrar = async (req,res) => {

    const {email, password, nombre} = req.body;

    // prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email:email})
    if(existeUsuario){
        const error = new Error('Usuario ya existente, Ingresa un usuario distinto');
        return res.status(400).json({msg: error.message});
    }

    try {
        // GUardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // ENVIAR EMAIL


        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }

   
    
};


const perfil = (req,res) => {

    const {veterinario} = req;
    res.json(veterinario);
}

const confirmar = async (req,res) => {
    const {token} =  req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar){
        const error= new Error('token no valido');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado=true
        await usuarioConfirmar.save()

        res.json({msg: "Usuario confirmado..."})
    } catch (error) {
        console.log(error);
    }

    
}


const autenticar = async (req, res) => {
    const {email, password,confirmado } = req.body;

    // comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario){
        const error= new Error('Usuario no existe');
        return res.status(404).json({msg: error.message});
    }


    // comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error= new Error('Su cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    // revisar el password
    if(await usuario.comprobarPassword(password)){
        // AUTENTICAR
        
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            web: usuario.web,
            telefono: usuario.telefono,

            token: generarJWT(usuario.id)


        })
    }else{
        const error= new Error('La contraseña es incorrecta');
        return res.status(403).json({msg: error.message});
    }
    


}

  // Olvidar password
  const olvidePassword= async(req,res)=>{
    const {email} = req.body;
    
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // ENVIAR EMAIL CON INSTRUCCIONES
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,

        })

        res.json({msg: "Hemos enviado un email con las instrucciones"})
        
    } catch (error) {
        console.log(error);
    }

  }

  const comprobarToken= async(req,res)=>{

    const {token} = req.params;

    const tokentValido = await Veterinario.findOne({token});


    if(tokentValido){
        // el token es valido y el usuario existe
        res.json({msg: "Token valido y el usuario existe"})
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }


  }

  const nuevoPassword= async(req,res)=>{
    // params es ur y body lo que el usuario escriba
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }try {

        veterinario.token = null;
        veterinario.password= password;
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'})
    } catch (error) {
        console.log(error);
    }

  }

  const actualizarPerfil =async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});

    }
    // CORREO UNICO
    const {email} = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error= new Error('Ese email ya esta en uso');
            return res.status(400).json({msg: error.message})
        }
    }
    try {
        veterinario.nombre = req.body.nombre  ;
        veterinario.email = req.body.email ;
        veterinario.web = req.body.web ;
        veterinario.telefono = req.body.telefono ;

        const VeterinarioActualizado = await veterinario.save();
        res.json(VeterinarioActualizado)
    } catch (error) {
        console.log(error)
        
    }
  }

//   ACTUALIZAR EL PASSWORD DEL VETERINARIO
  const actualizarPassword= async (req,res) =>{
    // Leer los datos
    const{id}=req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;


    // COMPROBAR QUE EL VETERINARIO EXISTA
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});

    }

    // COMPROBAR password
    if(await veterinario.comprobarPassword(pwd_actual)){
        // almacenar password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password almacenado correctamente'})
    }else{
        const error = new Error('El password actual es incorrecto');
        return res.status(400).json({msg: error.message});
    }

    // ALMACENAR EL NUEVO PASSWORD

  }
export {
    registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword
}