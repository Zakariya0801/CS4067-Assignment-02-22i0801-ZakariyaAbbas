const express = require('express')
const bcrypt = require('bcryptjs');
const {pool} = require('../dbConfig')

const getAllUsers = (req,res) => {

};

const getUser = (req,res) => {
    try{
        console.log("fetching use ", req.params.id);
    pool.query(
        `SELECT * FROM users
        WHERE id = $1`, [req.params.id], (err,results) => {
            if(err){
                console.log("erroringggg")
                throw err;
            }
            if(err)
                return res.status(200).json({ message: "Server error", error: err.message });
            if(results.rows.length > 0){
                res.status(200).json({ data: results.rows[0] });
                return;
            }
            else{
                res.status(500).json({ message: "Not Found" });
                return;

            }
            
        }
    );
    }catch(error){
        return res.status(500).json({ message: "Server error", error: error.message });
    }

};

const addNewUser = async (req,res) => {
    const { name,email,password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2,
    });

    if(password !== password2){
        res.send("not mtaching");
    }
    else{
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err,results) => {
                if(err){
                    throw err;
                }
                console.log(results.rows)

                if(results.rows.length > 0){
                    throw new Error('Already Exists')
                }
                
            }
        );

        res.send("hehehe")
    }
};


module.exports = {getAllUsers, addNewUser,getUser};