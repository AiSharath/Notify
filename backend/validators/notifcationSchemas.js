const { z } = require("zod");

const createNotificationSchema = z.object({
  recipientId: z.string().min(1, "Recipient ID is required"),
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(1, "Body is required"),
  channels: z
    .array(z.enum(["email", "push", "inapp"]))
    .min(1, "At least one channel is required")
    .refine(
      (channels) => new Set(channels).size === channels.length,
      "Duplicate channels are not allowed"
    ),
});

module.exports = { createNotificationSchema };