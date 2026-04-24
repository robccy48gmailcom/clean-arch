import { z } from "zod";
import { CreateAdminInput } from '../../../../interfaces/user'
import ZodValidator from "../validator"

const createAdminSchema: z.ZodType<CreateAdminInput> = z.object({
    email: z.email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(["admin", "user"])
})

export default new ZodValidator(createAdminSchema)