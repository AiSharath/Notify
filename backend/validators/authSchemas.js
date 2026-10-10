const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmpassword: z.string().min(1, "Confirm password is required")
}).refine(
    (data) => data.password === data.confirmpassword,
    {
        message: "Passwords do not match",
        path: ["confirmpassword"]
    }
);

const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

const refreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshSchema
};