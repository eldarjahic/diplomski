import swaggerJSDoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "Diplomski API",
			version: "1.0.0",
		},
		servers: [{ url: "/" }],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ["src/routes/*.ts", "src/docs/swagger.ts"],
};

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         email: { type: string, format: email }
 *         username: { type: string, nullable: true }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         role:
 *           type: string
 *           enum: [user, agent]
 *         isActive: { type: boolean }
 *     Property:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         title: { type: string }
 *         description: { type: string }
 *         type:
 *           type: string
 *           enum: [house, apartment, studio, land, commercial]
 *         listingType:
 *           type: string
 *           enum: [rent, buy]
 *         status:
 *           type: string
 *           enum: [available, sold, rented, pending]
 *         city: { type: string }
 *         address: { type: string }
 *         neighborhood: { type: string, nullable: true }
 *         latitude: { type: number, nullable: true }
 *         longitude: { type: number, nullable: true }
 *         price: { type: number }
 *         area: { type: number }
 *         bedrooms: { type: integer }
 *         bathrooms: { type: integer }
 *         parking: { type: integer, nullable: true }
 *         furnished: { type: boolean }
 *         balcony: { type: boolean }
 *         elevator: { type: boolean }
 *         heating: { type: boolean }
 *         imageUrl: { type: string, nullable: true }
 *         images:
 *           type: array
 *           items: { type: string }
 *           nullable: true
 *         googleMapsUrl: { type: string, nullable: true }
 *         phone: { type: string, nullable: true }
 *         owner:
 *           $ref: "#/components/schemas/User"
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     Message:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         sender: { $ref: "#/components/schemas/User" }
 *         recipient: { $ref: "#/components/schemas/User" }
 *         property:
 *           oneOf:
 *             - $ref: "#/components/schemas/Property"
 *             - { type: "null" }
 *         subject: { type: string, nullable: true }
 *         body: { type: string }
 *         isRead: { type: boolean }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email: { type: string, format: email }
 *         password: { type: string, minLength: 6 }
 *     RegisterRequest:
 *       type: object
 *       required: [email, firstName, lastName, username, password]
 *       properties:
 *         email: { type: string, format: email }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         username: { type: string }
 *         password: { type: string, minLength: 6 }
 *     PropertyCreateRequest:
 *       type: object
 *       required:
 *         [title, description, type, listingType, city, address, price, area, bedrooms, bathrooms, images]
 *       properties:
 *         title: { type: string }
 *         description: { type: string }
 *         type: { type: string, enum: [house, apartment, studio, land, commercial] }
 *         listingType: { type: string, enum: [rent, buy] }
 *         city: { type: string }
 *         address: { type: string }
 *         price: { type: number }
 *         area: { type: number }
 *         bedrooms: { type: integer }
 *         bathrooms: { type: integer }
 *         images:
 *           type: array
 *           items: { type: string }
 *     PropertyUpdateRequest:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         description: { type: string }
 *         type: { type: string, enum: [house, apartment, studio, land, commercial] }
 *         listingType: { type: string, enum: [rent, buy] }
 *         city: { type: string }
 *         address: { type: string }
 *         price: { type: number }
 *         area: { type: number }
 *         bedrooms: { type: integer }
 *         bathrooms: { type: integer }
 *         images:
 *           type: array
 *           items: { type: string }
 *     MessageCreateRequest:
 *       type: object
 *       properties:
 *         recipientId: { type: integer }
 *         propertyId: { type: integer }
 *         subject: { type: string }
 *         body: { type: string }
 */

export const swaggerSpec = swaggerJSDoc(options as any);


