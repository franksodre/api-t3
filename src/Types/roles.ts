import { Static, t } from 'elysia'

export type Roles = 'customer' | 'manager' | 'owner';

const CustomerSchema = t.Object({
  userID: t.String(),
})

const ManagerSchema = t.Object({
  managerID: t.String(),
  serviceID: t.String(),
})

const OwnerSchema = t.Object({
  OwnerID: t.String(),
})

export const RoleSchemas = t.Union([CustomerSchema, ManagerSchema, OwnerSchema]);

export type RoleProps<T extends Roles> = T extends 'customer'
  ? Static<typeof CustomerSchema>
  : T extends 'manager'
  ? Static<typeof ManagerSchema>
  : T extends 'owner'
  ? Static<typeof OwnerSchema>
  : never

// export type Props = {
//   customer: Static<typeof CustomerSchema>,
//   manager: Static<typeof ManagerSchema>,
//   owner: Static<typeof OwnerSchema>
// }

// type Pickup<T extends BlockProps, K extends keyof BlockProps> = Omit<T, K>
