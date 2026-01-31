import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function seedAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.warn("⚠️ Admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD) not found in .env. Skipping admin seeding.");
            return;
        }

        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            // console.log("✅ Admin user already exists.");
            return;
        }

        console.log("🛠️ Admin user not found. Creating one...");

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = new User({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            gstin: "N/A"
        });

        await newAdmin.save();
        console.log("✅ Admin user created successfully.");

    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
}
