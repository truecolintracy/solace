import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("payload").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  firstNameIdx: index('first_name_idx').on(table.firstName),
  lastNameIdx: index('last_name_idx').on(table.lastName),
  cityIdx: index('city_idx').on(table.city),
  phoneNumberIdx: index('phone_number_idx').on(table.phoneNumber),
  specialtiesIdx: index('specialties_idx').on(table.specialties),
  searchIdx: index('search_idx').using('gin', sql`(
    setweight(to_tsvector('english', ${table.firstName}), 'A') ||
    setweight(to_tsvector('english', ${table.lastName}), 'A') ||
    setweight(to_tsvector('english', ${table.city}), 'B') ||
    setweight(to_tsvector('english', ${table.specialties}::text), 'C')
  )`),
}));

export { advocates };
