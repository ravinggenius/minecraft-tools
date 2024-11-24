import { z } from "zod";

import { PROFILE } from "../profile/schema";

const ACTION_CREATE = z.literal("create");
const ACTION_READ = z.literal("read");
const ACTION_SHARE = z.literal("share");
const ACTION_UPDATE = z.literal("update");
const ACTION_DESTROY = z.literal("destroy");

const SCOPE_ANY = z.literal("any");
const SCOPE_NEW = z.literal("new");
const SCOPE_OWN = z.literal("own");
const SCOPE_ONE = z.literal("one");

const SUBJECT_COMPENDIUM = z.literal("compendium");
const SUBJECT_PROFILE = z.literal("profile");
const SUBJECT_RELEASE = z.literal("release");
const SUBJECT_WORLD = z.literal("world");

const COMMON = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	profileId: PROFILE.shape.id
});

interface Common extends z.infer<typeof COMMON> {}

////

// admin user allowed to view command area
export const ASSERTION_COMPENDIUM_READ = z
	.tuple([ACTION_READ, SCOPE_ANY, SUBJECT_COMPENDIUM])
	.transform(([action, scope, subject]) => ({ action, scope, subject }));

export type AssertionCompendiumReadTuple = z.input<
	typeof ASSERTION_COMPENDIUM_READ
>;

export interface AssertionCompendiumRead
	extends z.output<typeof ASSERTION_COMPENDIUM_READ> {}

// admin user allowed to create compendium entries
export const ASSERTION_COMPENDIUM_CREATE = z
	.tuple([ACTION_CREATE, SCOPE_NEW, SUBJECT_RELEASE])
	.transform(([action, scope, subject]) => ({ action, scope, subject }));

export type AssertionCompendiumCreateTuple = z.input<
	typeof ASSERTION_COMPENDIUM_CREATE
>;

export interface AssertionCompendiumCreate
	extends z.output<typeof ASSERTION_COMPENDIUM_CREATE> {}

// admin user allowed to manage compendium entries
export const ASSERTION_COMPENDIUM_MANAGE = z
	.tuple([
		z.union([ACTION_READ, ACTION_UPDATE, ACTION_DESTROY]),
		SCOPE_ANY,
		SUBJECT_RELEASE
	])
	.transform(([action, scope, subject]) => ({ action, scope, subject }));

export type AssertionCompendiumManageTuple = z.input<
	typeof ASSERTION_COMPENDIUM_MANAGE
>;

export interface AssertionCompendiumManage
	extends z.output<typeof ASSERTION_COMPENDIUM_MANAGE> {}

// any authenticated user should be able to manage their own profile
export const ASSERTION_PROFILE_MANAGE = z
	.tuple([ACTION_UPDATE, SCOPE_OWN, SUBJECT_PROFILE])
	.transform(([action, scope, subject]) => ({ action, scope, subject }));

export type AssertionProfileManageTuple = z.input<
	typeof ASSERTION_PROFILE_MANAGE
>;

export interface AssertionProfileManage
	extends z.output<typeof ASSERTION_PROFILE_MANAGE> {}

// any authenticated user should be able to create a world
// checked explicitly in case revocation is needed (in case of abuse)
export const ASSERTION_WORLD_CREATE = z
	.tuple([ACTION_CREATE, SCOPE_NEW, SUBJECT_WORLD])
	.transform(([action, scope, subject]) => ({ action, scope, subject }));

export type AssertionWorldCreateTuple = z.input<typeof ASSERTION_WORLD_CREATE>;

export interface AssertionWorldCreate
	extends z.output<typeof ASSERTION_WORLD_CREATE> {}

// any authenticated user is allowed to share their own worlds
// including ability to assign read/update permissions to other users
export const ASSERTION_WORLD_MANAGE = z
	.tuple([
		z.union([ACTION_READ, ACTION_SHARE, ACTION_UPDATE, ACTION_DESTROY]),
		SCOPE_OWN,
		SUBJECT_WORLD
	])
	.transform(([action, scope, subject]) => ({ action, scope, subject }));

export type AssertionWorldManageTuple = z.input<typeof ASSERTION_WORLD_MANAGE>;

export interface AssertionWorldManage
	extends z.output<typeof ASSERTION_WORLD_MANAGE> {}

// authenticated user allowed read/update shared world
export const ASSERTION_WORLD_GUEST = z
	.tuple([
		z.union([ACTION_READ, ACTION_UPDATE]),
		SCOPE_ONE,
		SUBJECT_WORLD,
		z.object({
			worldId: z.string().uuid()
		})
	])
	.transform(([action, scope, subject, auxiliary]) => ({
		action,
		scope,
		subject,
		auxiliary
	}));

export type AssertionWorldGuestTuple = z.input<typeof ASSERTION_WORLD_GUEST>;

export interface AssertionWorldGuest
	extends z.output<typeof ASSERTION_WORLD_GUEST> {}

////

export const ASSERTION = z.union([
	ASSERTION_COMPENDIUM_READ,
	ASSERTION_COMPENDIUM_CREATE,
	ASSERTION_COMPENDIUM_MANAGE,
	ASSERTION_PROFILE_MANAGE,
	ASSERTION_WORLD_CREATE,
	ASSERTION_WORLD_MANAGE,
	ASSERTION_WORLD_GUEST
]);

export type AssertionTuple = z.input<typeof ASSERTION>;

export type Assertion =
	| AssertionCompendiumRead
	| AssertionCompendiumCreate
	| AssertionCompendiumManage
	| AssertionProfileManage
	| AssertionWorldCreate
	| AssertionWorldManage
	| AssertionWorldGuest;

export const PERMISSION = COMMON.and(ASSERTION);

export type Permission = Common & Assertion;
