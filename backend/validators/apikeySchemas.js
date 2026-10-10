const { z } = require("zod");

const createApiKeySchema = z.object({
    name: z.string().trim().min(1, "API key name is required"),
    scopes: z.array(z.string().trim().min(1)).optional().default([])
});

module.exports = {
    createApiKeySchema
};