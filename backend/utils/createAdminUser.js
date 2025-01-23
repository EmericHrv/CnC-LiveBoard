import { User } from '../models/index.js';

const createAdminUser = async () => {
    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            throw new Error('Admin credentials are missing from environment variables.');
        }

        const existingAdmin = await User.findOne({ username: adminUsername });
        if (!existingAdmin) {
            const adminUser = new User({
                username: adminUsername,
                password: adminPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log(`Admin user '${adminUsername}' created successfully.`);
        } else {
            console.log(`Admin user '${adminUsername}' already exists.`);
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

export default createAdminUser;
