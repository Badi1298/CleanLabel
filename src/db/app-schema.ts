import { relations } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const productScoreEnum = pgEnum("product_score", [
	"gold",
	"silver",
	"bronze",
	"none",
]);
export const productStatusEnum = pgEnum("product_status", [
	"pending_review",
	"approved",
	"rejected",
]);

export const categories = pgTable("categories", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	iconUrl: text("icon_url"),
});

export const stores = pgTable("stores", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	logoUrl: text("logo_url"),
});

export const products = pgTable("products", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	brand: text("brand").notNull(),
	categoryId: text("category_id")
		.notNull()
		.references(() => categories.id),
	score: productScoreEnum("score").default("none").notNull(),
	imageFrontUrl: text("image_front_url"),
	imageBackUrl: text("image_back_url"),
	rawIngredientsText: text("raw_ingredients_text"),
	status: productStatusEnum("status").default("approved").notNull(),
	submittedById: text("submitted_by_id").references(() => user.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const ingredients = pgTable("ingredients", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	hazardLevel: text("hazard_level"),
});

// ---  (Many-to-Many) ---
export const productIngredients = pgTable(
	"product_ingredients",
	{
		productId: text("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		ingredientId: text("ingredient_id")
			.notNull()
			.references(() => ingredients.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.productId, t.ingredientId] })],
);

export const productStores = pgTable(
	"product_stores",
	{
		productId: text("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		storeId: text("store_id")
			.notNull()
			.references(() => stores.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.productId, t.storeId] })],
);

// --- Relații la nivel de Drizzle ORM ---
// Acestea nu modifică DB-ul, dar te ajută enorm când faci query-uri (ex: db.query.products.findMany({ with: { category: true } }))

export const productsRelations = relations(products, ({ one, many }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	submittedBy: one(user, {
		fields: [products.submittedById],
		references: [user.id],
	}),
	productIngredients: many(productIngredients),
	productStores: many(productStores),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	products: many(products),
}));

export const storesRelations = relations(stores, ({ many }) => ({
	productStores: many(productStores),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
	productIngredients: many(productIngredients),
}));

export const productIngredientsRelations = relations(
	productIngredients,
	({ one }) => ({
		product: one(products, {
			fields: [productIngredients.productId],
			references: [products.id],
		}),
		ingredient: one(ingredients, {
			fields: [productIngredients.ingredientId],
			references: [ingredients.id],
		}),
	}),
);

export const productStoresRelations = relations(productStores, ({ one }) => ({
	product: one(products, {
		fields: [productStores.productId],
		references: [products.id],
	}),
	store: one(stores, {
		fields: [productStores.storeId],
		references: [stores.id],
	}),
}));
