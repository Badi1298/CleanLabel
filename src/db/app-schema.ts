import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	jsonb,
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
	parentId: text("parent_id").references((): any => categories.id, { onDelete: "cascade" }),
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
	barcode: text("barcode").unique(),
	name: text("name").notNull(),
	brand: text("brand").notNull(),
	score: productScoreEnum("score").default("none").notNull(),
	imageFrontUrl: text("image_front_url"),
	imageBackUrl: text("image_back_url"),
	rawIngredientsText: text("raw_ingredients_text"),
	status: productStatusEnum("status").default("approved").notNull(),
	offTags: jsonb("off_tags").$type<string[]>(),
	isReviewed: boolean("is_reviewed").default(false).notNull(),
	submittedById: text("submitted_by_id").references(() => user.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	offIngredients: jsonb("off_ingredients").$type<string[]>(),
});

export const ingredients = pgTable("ingredients", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	hazardLevel: text("hazard_level"),
	description: text("description"),
});

export const offCategoryMappings = pgTable("off_category_mappings", {
	offTag: text("off_tag").primaryKey(),
	categoryId: text("category_id")
		.notNull()
		.references(() => categories.id, { onDelete: "cascade" }),
});

export const unmappedOffTags = pgTable("unmapped_off_tags", {
	tag: text("tag").primaryKey(),
	occurrences: integer("occurrences").default(1).notNull(),
});

export const offIngredientMappings = pgTable("off_ingredient_mappings", {
	offTag: text("off_tag").primaryKey(),
	ingredientId: text("ingredient_id")
		.notNull()
		.references(() => ingredients.id, { onDelete: "cascade" }),
});

export const unmappedOffIngredients = pgTable("unmapped_off_ingredients", {
	tag: text("tag").primaryKey(),
	occurrences: integer("occurrences").default(1).notNull(),
});

// --- Junction Tables ---
export const userExcludedIngredients = pgTable(
	"user_excluded_ingredients",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		ingredientId: text("ingredient_id")
			.notNull()
			.references(() => ingredients.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.userId, t.ingredientId] })],
);

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

export const productCategories = pgTable(
	"product_categories",
	{
		productId: text("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		categoryId: text("category_id")
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.productId, t.categoryId] })],
);

// --- Drizzle ORM Relations ---

export const productsRelations = relations(products, ({ one, many }) => ({
	submittedBy: one(user, {
		fields: [products.submittedById],
		references: [user.id],
	}),
	productIngredients: many(productIngredients),
	productStores: many(productStores),
	productCategories: many(productCategories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	productCategories: many(productCategories),
	offCategoryMappings: many(offCategoryMappings),
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "category_parent",
	}),
	subcategories: many(categories, {
		relationName: "category_parent",
	}),
}));

export const offCategoryMappingsRelations = relations(
	offCategoryMappings,
	({ one }) => ({
		category: one(categories, {
			fields: [offCategoryMappings.categoryId],
			references: [categories.id],
		}),
	}),
);

export const storesRelations = relations(stores, ({ many }) => ({
	productStores: many(productStores),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
	productIngredients: many(productIngredients),
	offIngredientMappings: many(offIngredientMappings),
	userExcludedIngredients: many(userExcludedIngredients),
}));

export const offIngredientMappingsRelations = relations(
	offIngredientMappings,
	({ one }) => ({
		ingredient: one(ingredients, {
			fields: [offIngredientMappings.ingredientId],
			references: [ingredients.id],
		}),
	}),
);

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

export const userExcludedIngredientsRelations = relations(
	userExcludedIngredients,
	({ one }) => ({
		user: one(user, {
			fields: [userExcludedIngredients.userId],
			references: [user.id],
		}),
		ingredient: one(ingredients, {
			fields: [userExcludedIngredients.ingredientId],
			references: [ingredients.id],
		}),
	}),
);

export const productCategoriesRelations = relations(
	productCategories,
	({ one }) => ({
		product: one(products, {
			fields: [productCategories.productId],
			references: [products.id],
		}),
		category: one(categories, {
			fields: [productCategories.categoryId],
			references: [categories.id],
		}),
	}),
);
