const prisma = require('../config/client');

import {userTypes} from './seed/userTypes'
import {auths} from './seed/auths'
import {users} from './seed/users'
import {genderTypes} from './seed/genderTypes'
import {patients} from './seed/patients'

const loadData = async () => {

    console.log('loading data started...');

    // deleting 
    console.log('cleanning up the database...');

    await prisma.user.deleteMany();
    console.log("Deleted records in user table");


    await prisma.Auth.deleteMany();
    console.log("Deleted records in Auth table");


    await prisma.userType.deleteMany();
    console.log("Deleted records in userType table");

    await prisma.Patient.deleteMany();
    console.log("Deleted records in Patient table");

    await prisma.genderType.deleteMany();
    console.log("Deleted records in genderType table");

    await prisma.$queryRaw`ALTER TABLE userType AUTO_INCREMENT = 1`;
    console.log("reset userType auto increment to 1");
    await prisma.$queryRaw`ALTER TABLE genderType AUTO_INCREMENT = 1`;
    console.log("reset genderType auto increment to 1");
    ////////////////////////////////////////////////////////////////////


    // inserting
    await prisma.userType.createMany({
        data: userTypes
    });
    console.log("Added userType data");

    await prisma.Auth.createMany({
        data: auths
    });
    console.log("Added Auth data");

    await prisma.user.createMany({ 
        data: users
    });
    console.log("Added user data");

    await prisma.genderType.createMany({
        data: genderTypes
    });
    console.log("Added genderType data");

    await prisma.Patient.createMany({
        data: patients
    });
    console.log("Added patient data");
    /////////////////////////////////////////////////////////////////////


}

loadData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // await prisma.$disconnect();
        console.log('Data loaded...');
    });