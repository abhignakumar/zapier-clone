import z from "zod";

export const userSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  name: z.string().min(3).optional(),
});

export const userLogInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const createZapSchema = z.object({
  userId: z.string(),
  availableTriggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      actionMetadata: z.any().optional(),
    })
  ),
});
