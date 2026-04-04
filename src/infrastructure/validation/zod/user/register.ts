import { z } from "zod";
import ZodValidator from "../validator"

const registerSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "must match password",
        });
    }
});

export default new ZodValidator(registerSchema);