const CheltuialaDb = require("../models").cheltuiala;

const controller = {
    createCheltuiala: async (req,res) => {
        try{
            const cheltuiala = await CheltuialaDb.create({
                suma: req.body.suma,
                data: req.body.data,
                detalii: req.body.detalii,
                id_utilizator: req.body.id_utilizator,
                id_categorie: req.body.id_categorie,
            });
            res.status(201).send(cheltuiala);
        }catch(err){
            res.status(500).send(err.message);
        }
    },

    updateCheltuiala: async (req,res) => {
        try{
            const cheltuiala = await CheltuialaDb.findByPk(req.params.id);
            if(!cheltuiala) return res.status(404).send("Cheltuiala nu a fost gasita");

            const updated = await cheltuiala.update({
                suma: req.body.suma,
                data: req.body.data,
                detalii: req.body.detalii,
                id_utilizator: req.body.id_utilizator,
                id_categorie: req.body.id_categorie,
            });
            res.status(200).send(updated); 
        }catch(err){
            res.status(500).send(err.message);
        }
    },

    deleteCheltuiala: async(req,res) => {
        try{
            const cheltuiala = await CheltuialaDb.findByPk(req.params.id);
            if(!cheltuiala) return res.status(404).send("Cheltuiala nu a fost gasita");

            await cheltuiala.destroy();
            res.status(200).send("Cheltuiala stearsa");
        }catch(err){
            res.status(500).send(err.message);
        }
    },

    getAllCheltuieli: async (req,res) => {
        try{
            const cheltuieli = await CheltuialaDb.findAll();
            res.status(200).send(cheltuieli);
        }catch(err){
            res.status(500).send(err.message);
        }
    },

    getCheltuialaById: async (req,res) => {
        try{
            const cheltuiala = await CheltuialaDb.findByPk(req.params.id);
            if(!cheltuiala) return res.status(404).send("Cheltuiala nu a fost gasita!")
                res.status(200).send(cheltuiala);
        }catch(err){
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;