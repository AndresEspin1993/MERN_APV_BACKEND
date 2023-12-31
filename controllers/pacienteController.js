import Paciente from "../models/Paciente.js";
import mongoose from 'mongoose';

const agregarPaciente = async (req,res) => {

    // console.log(req.body);

    const paciente = new Paciente(req.body);
    // console.log(paciente);
    paciente.veterinario= req.veterinario._id;

    try {
        
        // console.log(paciente);
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {

        console.log(error);
        
    }
};


const obtenerPacientes = async (req, res) => {
    // 'veterinario' eso es la columna en la base de dats
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);

};

const obtenerPaciente = async (req, res) => {
    // console.log(req.params.id);
    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    // console.log(paciente);

    if(!paciente){
       return res.status(404).json({msg: "No encontrado"});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Accion no valida'});
    }

    res.json(paciente);

    
};

const actualizarPaciente = async (req, res) => {

    const {id} = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: "No encontrado"});
    }
    

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Accion no valida'});
    }

    
        // actualizar paciente
        paciente.nombre= req.body.nombre || paciente.nombre;
        paciente.propietario= req.body.propietario || paciente.propietario;
        paciente.email= req.body.email || paciente.email;
        paciente.fecha= req.body.fecha || paciente.fecha;
        paciente.sintomas= req.body.sintomas || paciente.sintomas;
        
        
        try {
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado);
            
        } catch (error) {
            console.log(error);
        }
    
  

};

const eliminarPaciente = async (req, res) => {
  
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(403).json({ msg: error.message });
    }

    const paciente = await Paciente.findById(id);

    if(!paciente ){
        
        return res.status(404).json({msg: error.message});
    }
    

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Accion no valida'});
    }


    try {
        await paciente.deleteOne();
        res.json({msg: 'paciente eliminado'});
        
    } catch (error) {
        console.log(error);
    }


};

export {agregarPaciente, obtenerPacientes,obtenerPaciente, actualizarPaciente, eliminarPaciente};