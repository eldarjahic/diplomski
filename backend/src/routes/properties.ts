import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Property } from "../entity/property";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all properties with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      city,
      listingType,
      minPrice,
      maxPrice,
      type,
      bedrooms,
      bathrooms,
      status,
    } = req.query;

    const propertyRepository = AppDataSource.getRepository(Property);
    const queryBuilder = propertyRepository.createQueryBuilder("property");

    // Apply filters
    if (city) {
      queryBuilder.andWhere("LOWER(property.city) LIKE LOWER(:city)", {
        city: `%${city}%`,
      });
    }

    if (listingType) {
      queryBuilder.andWhere("property.listingType = :listingType", {
        listingType,
      });
    }

    if (minPrice) {
      queryBuilder.andWhere("property.price >= :minPrice", {
        minPrice: Number(minPrice),
      });
    }

    if (maxPrice) {
      queryBuilder.andWhere("property.price <= :maxPrice", {
        maxPrice: Number(maxPrice),
      });
    }

    if (type) {
      queryBuilder.andWhere("property.type = :type", { type });
    }

    if (bedrooms) {
      queryBuilder.andWhere("property.bedrooms >= :bedrooms", {
        bedrooms: Number(bedrooms),
      });
    }

    if (bathrooms) {
      queryBuilder.andWhere("property.bathrooms >= :bathrooms", {
        bathrooms: Number(bathrooms),
      });
    }

    if (status) {
      queryBuilder.andWhere("property.status = :status", { status });
    } else {
      // Default: only show available properties
      queryBuilder.andWhere("property.status = :status", {
        status: "available",
      });
    }

    queryBuilder
      .leftJoinAndSelect("property.owner", "owner")
      .orderBy("property.createdAt", "DESC");

    const properties = await queryBuilder.getMany();

    res.send(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).send({ error: "Failed to fetch properties" });
  }
});

// Get single property by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const propertyRepository = AppDataSource.getRepository(Property);

    const property = await propertyRepository.findOne({
      where: { id: Number(id) },
      relations: ["owner"],
    });

    if (!property) {
      return res.status(404).send({ error: "Property not found" });
    }

    res.send(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).send({ error: "Failed to fetch property" });
  }
});

// Create new property (requires authentication)
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const propertyData = req.body;
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "type",
      "listingType",
      "city",
      "address",
      "price",
      "area",
      "bedrooms",
      "bathrooms",
    ];

    for (const field of requiredFields) {
      if (!propertyData[field] && propertyData[field] !== 0) {
        return res.status(400).send({
          error: `Missing required field: ${field}`,
        });
      }
    }

    const propertyRepository = AppDataSource.getRepository(Property);

    // Clean up the data - remove empty strings and convert types
    const cleanData = {
      ...propertyData,
      parking: propertyData.parking ? Number(propertyData.parking) : null,
      latitude: propertyData.latitude ? Number(propertyData.latitude) : null,
      longitude: propertyData.longitude ? Number(propertyData.longitude) : null,
      price: Number(propertyData.price),
      area: Number(propertyData.area),
      bedrooms: Number(propertyData.bedrooms),
      bathrooms: Number(propertyData.bathrooms),
      neighborhood: propertyData.neighborhood || null,
      phone: propertyData.phone || null,
      imageUrl: propertyData.imageUrl || null,
      googleMapsUrl: propertyData.googleMapsUrl || null,
      images: propertyData.images && Array.isArray(propertyData.images) 
        ? propertyData.images 
        : null,
      status: propertyData.status || "available",
      owner: { id: userId },
    };

    const newProperty = propertyRepository.create(cleanData);

    const savedProperty = await propertyRepository.save(newProperty);

    res.status(201).send(savedProperty);
  } catch (error: any) {
    console.error("Error creating property:", error);
    // Return more detailed error message
    const errorMessage =
      error.message || "Failed to create property";
    res.status(500).send({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Update property (requires authentication)
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.userId;
    const propertyRepository = AppDataSource.getRepository(Property);

    const property = await propertyRepository.findOne({
      where: { id: Number(id) },
      relations: ["owner"],
    });

    if (!property) {
      return res.status(404).send({ error: "Property not found" });
    }

    // Check if user owns the property or is an admin
    if (property.owner.id !== userId) {
      return res.status(403).send({ error: "Forbidden" });
    }

    Object.assign(property, req.body);
    const updatedProperty = await propertyRepository.save(property);

    res.send(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).send({ error: "Failed to update property" });
  }
});

// Delete property (requires authentication)
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.userId;
    const propertyRepository = AppDataSource.getRepository(Property);

    const property = await propertyRepository.findOne({
      where: { id: Number(id) },
      relations: ["owner"],
    });

    if (!property) {
      return res.status(404).send({ error: "Property not found" });
    }

    // Check if user owns the property or is an admin
    if (property.owner.id !== userId) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await propertyRepository.remove(property);

    res.send({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).send({ error: "Failed to delete property" });
  }
});

export default router;

