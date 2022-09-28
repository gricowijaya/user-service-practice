const { User } = require('../models')
const bcrypt = require('bcrypt')

module.exports = {
    create: async(req, res, next) => {
        try {
            const { email, name, password } = req.body;
            
            const exists = await User.findOne({
                where: {
                    email: email
                } 
            });

            if (exists) {
                return res.status(400).json({
                    status: false,
                    message: "User already registered!",
                    data: null
                })                
            }

            const encrypt = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: encrypt
            });

            return res.status(201).json({
                status: true, 
                message: "Successfully registered",
                data: { 
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch(err) {
            next(err);
        }
    },

    findByEmail: async(req, res, next) => {
        try {
            const where = {};
            const { id, email } = req.body;

            if (id) { 
                where.id = id;
            }

            if (email) {
                where.email = email;
            }

            const user = await User.findOne({ where });

            console.log(req);

            if (!user) {
                return res.status(500).json({
                    status: false, 
                    message: "No User",
                    data: null
                });
            }

            return res.status(201).json({
                status: true, 
                message: "Successfully found",
                data: { 
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password
                }
            });
        } catch(err) {
            next(err);
        }
    },

    updatePassword: async(req, res, next) => {
        try {
            const where = {}

            const { id, email, old_password, new_password } = req.body;

            if (id) { 
                where.id = id;
            }

            if (email) {
                where.email = email;
            }

            const user = await User.findOne({ where });


            if (!user) {
                return res.status(500).json({
                    status: false, 
                    message: "No User",
                    data: null
                });
            }

            const compare = bcrypt.compare(old_password, user.password);

            if (!compare) {
                return res.status(400).json({
                    status:false,
                    message: "Wrong old Password!",
                    data: null
                })
            }

            // ecnrypt the new password
            const encrypt = await bcrypt.hash(new_password, 10);

            const updatePassword = await User.update({password: encrypt},{
                where : {
                    email
                } 
            });

            return res.status(201).json({
                status: true, 
                message: "Successfully update password",
                data: updatePassword
            });
        } catch(err) {
            next(err);
        }
    }
}
