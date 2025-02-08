const express = require('express')
const bcrypt = require('bcrypt');
const {pool} = require('../dbConfig')

const getAllUsers = (req,res) => {

};

const getUser = (req,res) => {

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