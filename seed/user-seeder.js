var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config();

mongoose.Promise = global.Promise;

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/HRMS');
        console.log('Connected to database for seeding...');

        var users = [
            new User({
                type: 'project_manager',
                email: 'pm@pm.com',
                password: bcrypt.hashSync('pm1234', bcrypt.genSaltSync(parseInt(process.env.BCRYPT_ROUNDS) || 5), null),
                name: 'Project manager',
                dateOfBirth: new Date('1990-05-26'),
                contactNumber: '0333-4552191',
            }),
            new User({
                type: 'accounts_manager',
                email: 'am@am.com',
                password: bcrypt.hashSync('am1234', bcrypt.genSaltSync(parseInt(process.env.BCRYPT_ROUNDS) || 5), null),
                name: 'Accounts Manager',
                dateOfBirth: new Date('1990-05-26'),
                contactNumber: '0300-4814710',
            }),
            new User({
                type: 'employee',
                email: 'anshu@gmail.com',
                password: bcrypt.hashSync('123456', bcrypt.genSaltSync(parseInt(process.env.BCRYPT_ROUNDS) || 5), null),
                name: 'Anshuman Mittal',
                dateOfBirth: new Date('1990-05-26'),
                contactNumber: '0333-4552191',
            }),
            new User({
                type: 'employee',
                email: 'ShivamSharma@sample.com',
                password: bcrypt.hashSync('123456', bcrypt.genSaltSync(parseInt(process.env.BCRYPT_ROUNDS) || 5), null),
                name: 'Shivam Sharma',
                dateOfBirth: new Date('1990-05-26'),
                contactNumber: '0300-4814710',
            }),
            new User({
                type: 'admin',
                email: 'admin@admin.com',
                password: bcrypt.hashSync('admin123', bcrypt.genSaltSync(parseInt(process.env.BCRYPT_ROUNDS) || 5), null),
                name: 'Asutosh Yadav',
                dateOfBirth: new Date('1990-05-26'),
                contactNumber: '0300-4297859',
            }),
        ];

        for (const user of users) {
            const existing = await User.findOne({ email: user.email });
            if (!existing) {
                await user.save();
                console.log(`Created user: ${user.email} (${user.type})`);
            } else {
                console.log(`User already exists: ${user.email} (${user.type})`);
            }
        }

        console.log('Database seeding completed successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database.');
    }
}

seedUsers();