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
  availableTriggerId: z.string().min(1),
  triggerMetadata: z.any().optional(),
  actions: z.array(
    z.object({
      availableActionId: z.string().min(1),
      actionMetadata: z.any().optional(),
      order: z.number(),
    })
  ),
});

export const updateZapSchema = createZapSchema.extend({ zapId: z.string() });
