const models = require('../models');
const Validator = require('fastest-validator');
const { updateOrCreateAttendance } = require('./attendance.controller');
const cron = require('node-cron');
const { profile } = require('console');


// Function to calculate age from birthdate
function calculateAge(birthdate) {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

// Function to find roleName by role ID
function findRoleNameByRoleId(roleId) {
    return models.Role.findByPk(roleId).then(role => role ? role.roleName : null);
}

// Create function to save BioData
function BioDataSave(req, res) {
    const {
    // setTimeout(() => {
        userId,
        nameWini,
        nameWFull,
        birthdate,
        roleName, // This is roleName instead of roleId
        gender,
        address,
        email,
        bankNumber,
        phoneNumber,
    // }), 4000;
        imgSrc
    } = req.body;

    if (!userId || !nameWini || !nameWFull || !birthdate || !roleName || !gender || !address || !email || !bankNumber || !phoneNumber || !imgSrc) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Validation schema
    const schema = {
        userId: { type: "number", optional: false, max: "100", unique: true },
        nameWini: { type: "string", optional: false, max: "100" },
        nameWFull: { type: "string", optional: false, max: "200" },
        birthdate: { type: "string", optional: false }, // Change type to string
        roleName: { type: "string", optional: false, max: "100" },
        gender: { type: "string", optional: false, max: "100" },
        address: { type: "string", optional: false, max: "300" },
        phoneNumber: { type: "string", optional: false, max: "10" },
        bankNumber: { type: "string", optional: false, max: "15" },
        imgSrc: { type: "string", optional: true, max: "300" }
    };

    // Create a validator instance
    const v = new Validator();
    const validationResponse = v.validate(req.body, schema);

    // Check if validation failed
    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }


    // Find the role based on the roleName
    models.Role.findOne({
        where: { roleName: roleName }
    }).then(role => {
        if (!role) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        const age = calculateAge(req.body.birthdate);

        // Now we have the roleId, proceed to save BioData
        models.BioData.create({
            userId: userId,
            nameWini: nameWini,
            nameWFull: nameWFull,
            birthdate: birthdate,
            age: calculateAge(req.body.birthdate), // Automatically generate age
            roleId: role.id, // Use the found roleId
            gender: gender,
            address: address,
            email: email,
            phoneNumber: phoneNumber,
            bankNumber: bankNumber,
            imgSrc: imgSrc
        }).then(result => {
            // Fetch roleName by roleId and then update/create attendance
            findRoleNameByRoleId(role.id)
                .then(fetchedRoleName => {
                    if (!fetchedRoleName) {
                        return res.status(404).json({
                            message: "Role name not found"
                        });
                    }
                    return updateOrCreateAttendance(userId, fetchedRoleName, nameWini).then(() => {
                        res.status(201).json({
                            message: "BioData saved successfully",
                            bioData: result
                        });
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: "Something went wrong",
                        error: error
                    });
                });
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

cron.schedule('0 0 * * *', () => { // Runs every day at midnight
    console.log('Running daily attendance update...');
    models.BioData.findAll().then(bioDataRecords => {
        bioDataRecords.forEach(record => {
            const { userId, roleId, nameWini } = record;
            findRoleNameByRoleId(roleId).then(roleName => {
                if (roleName) {
                    updateOrCreateAttendance(userId, roleName, nameWini)
                        .then(() => {
                            console.log("Attendance updated for user: ${nameWini}");
                        })
                        .catch(error => {
                            console.error("Failed to update attendance for user: ${nameWini}", error);
                        });
                }
            });
        });
    }).catch(error => {
        console.error('Failed to fetch BioData records:', error);
    });
});


// Function to get uploaded file info
function getUploadedFile(req, res) {
    const filename = req.params.filename;
    models.BioData.findOne({ where: { image: filename } })
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "File not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Something went wrong", error: err.message });
        });
}

// Create Function Show BioDataSave
function BioDataShow(req, res) {
    models.BioData.findAll({
        include: [
            {
                model: models.Role,
                as: 'role',
                attributes: ['roleName'],
            }]
        // Include Role model to get roleName
    }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

// Create function to show userId biodata table's data
function biodataShowId(req, res) {
    models.BioData.findAll({
        where: {
            userId: req.params.userId
        },
        //get role by roleId
        include: [
            {
                model: models.Role,
                as: 'role',
                attributes: ['roleName'],
            }]
    }).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: "User not found"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

// Create function to destroy BioData table id
function BioDataDelete(req, res) {
    const tableId = req.params.id;

    models.BioData.findByPk(tableId).then(result => {
        if (!result) {
            return res.status(404).json({
                message: "BioData not found"
            });
        }
        const userId = result.userId; // Get the userId before destroying the BioData record

        result.destroy().then(() => {
            // Now delete the corresponding attendance record
            models.Attendance.destroy({
                where: { userId: userId }
            }).then(() => {
                res.status(200).json({
                    message: "BioData and corresponding attendance deleted successfully"
                });
            }).catch(error => {
                res.status(500).json({
                    message: "Failed to delete attendance",
                    error: error
                });
            });
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

// Create function to Update BioData table
function BioDataUpdate(req, res) {
    const tableId = req.params.id;
    const {
        userId,
        nameWini,
        nameWFull,
        birthdate,
        roleName,
        gender,
        address,
        email,
        bankNumber,
        phoneNumber,
        imgSrc
    } = req.body;

    // Validation schema
    const schema = {
        userId: { type: "number", optional: false, max: "100", unique: true },
        nameWini: { type: "string", optional: false, max: "100" },
        nameWFull: { type: "string", optional: false, max: "200" },
        birthdate: { type: "string", optional: false }, // Change type to string
        roleName: { type: "string", optional: false, max: "100" },
        gender: { type: "string", optional: false, max: "100" },
        address: { type: "string", optional: false, max: "300" },
        bankNumber: { type: "string", optional: false, max: "15" },
        phoneNumber: { type: "string", optional: false, max: "10" },
        imgSrc: { type: "string", optional: true, max: "300" }
    };

    // Create a validator instance
    const v = new Validator();
    const validationResponse = v.validate(req.body, schema);

    // Check if validation failed
    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.Role.findOne({
        where: { roleName: roleName }
    }).then(role => {
        if (!role) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        // Now we have the roleId, proceed to update BioData
        models.BioData.findByPk(tableId).then(result => {
            if (!result) {
                return res.status(404).json({
                    message: "BioData not found"
                });
            }

            result.userId = userId;
            result.nameWini = nameWini;
            result.nameWFull = nameWFull;
            result.birthdate = birthdate;
            result.age = calculateAge(req.body.birthdate);
            result.roleId = role.id; // Update roleId with the found roleId
            result.gender = gender;
            result.address = address;
            result.email = email;
            result.bankNumber = bankNumber;
            result.phoneNumber = phoneNumber;
            result.imgSrc = imgSrc;

            result.save().then(updatedBioDataRecord => {
                // Fetch roleName by roleId and then update/create attendance
                findRoleNameByRoleId(role.id)
                    .then(fetchedRoleName => {
                        if (!fetchedRoleName) {
                            return res.status(404).json({
                                message: "Role name not found"
                            });
                        }
                        updateOrCreateAttendance(userId, fetchedRoleName, nameWini, null, null)
                            .then(() => {
                                res.status(200).json({
                                    message: "BioData updated successfully",
                                    bioData: updatedBioDataRecord
                                });
                            })
                            .catch(error => {
                                res.status(500).json({
                                    message: "Failed to update attendance",
                                    error: error
                                });
                            });
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: "Something went wrong",
                            error: error
                        });
                    });
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong",
                    error: error
                });
            });
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

// Function to find role ID by role name (if needed)
function findRoleIDbyRoleName(req, res) {
    const roleName = req.params.roleName;
    models.Role.findOne({
        where: { roleName: roleName }
    }).then(role => {
        if (!role) {
            return res.status(404).json({
                message: "Role not found"
            });
        }
        res.status(200).json({
            message: "Role found",
            role: role
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

// Export functions
module.exports = {
    BioDataSave,
    BioDataShow,
    biodataShowId,
    BioDataUpdate,
    BioDataDelete,
    findRoleIDbyRoleName,
};