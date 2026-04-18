# DB Schema Change

Add or modify a Prisma model and push to the live database.

## Rules
- NEVER use `prisma migrate` — this project uses `prisma db push` (schema-first, no migration files)
- NEVER drop columns that have data — add new nullable columns instead
- Always add sensible defaults for new non-nullable fields

## Steps

### 1. Edit `prisma/schema.prisma`
```prisma
model YourModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // your fields
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

Add the reverse relation to the related model (e.g., `User`):
```prisma
model User {
  // existing fields ...
  yourModels YourModel[]
}
```

### 2. Push schema to dev DB
```bash
npx prisma db push
```

This syncs the schema without creating migration files. Safe for development.

### 3. Generate Prisma client
```bash
npx prisma generate
```

### 4. Push schema to production DB
The production DB is accessed via the env vars in `.env.production`.
```bash
# SSH into VPS and run from the container
ssh root@187.77.188.36 "cd /root/tuitionsinindia && docker compose exec web npx prisma db push"
```

Or add it to the deploy pipeline if schema changes are part of the deploy.

### 5. Verify
- Run `npx prisma studio` locally to browse the DB and confirm the new table/column exists
- Check that existing rows are intact

## Common gotchas
- **Relation missing** — if you add a `@relation` but forget the `@id` field on the foreign model, db push will error
- **Non-nullable column on existing table** — add `@default("")` or make it optional (`String?`) to avoid breaking existing rows
- **Enum values** — adding a new enum value is safe; renaming or removing one is destructive

$ARGUMENTS
