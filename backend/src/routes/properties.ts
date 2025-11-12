import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Property } from "../entity/property";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

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

const sanitizeImages = (images?: unknown): string[] => {
  if (!Array.isArray(images)) {
    return [];
  }
  return images
    .filter(
      (img): img is string => typeof img === "string" && img.trim().length > 0
    )
    .map((img) => img.trim());
};

const parseNumberField = (
  value: unknown,
  field: string,
  fallback?: number | null
): number | null => {
  if (value === undefined || value === null || value === "") {
    return fallback ?? null;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid value for ${field}`);
  }
  return parsed;
};

const preparePropertyData = (
  data: any,
  options: {
    requireImages?: boolean;
    existingProperty?: Property | null;
  } = {}
) => {
  const { requireImages = false, existingProperty = null } = options;

  for (const field of requiredFields) {
    if (
      (data[field] === undefined ||
        data[field] === null ||
        data[field] === "") &&
      !existingProperty
    ) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const images = sanitizeImages(data.images);

  if (requireImages && images.length === 0) {
    throw new Error("At least one image is required");
  }

  const cleanData: Partial<Property> = {
    title: data.title ?? existingProperty?.title ?? "",
    description: data.description ?? existingProperty?.description ?? "",
    type: data.type ?? existingProperty?.type ?? "apartment",
    listingType: data.listingType ?? existingProperty?.listingType ?? "rent",
    city: data.city ?? existingProperty?.city ?? "",
    address: data.address ?? existingProperty?.address ?? "",
    neighborhood: data.neighborhood ?? existingProperty?.neighborhood ?? null,
    price:
      parseNumberField(
        data.price,
        "price",
        existingProperty?.price ?? undefined
      ) ?? 0,
    area:
      parseNumberField(
        data.area,
        "area",
        existingProperty?.area ?? undefined
      ) ?? 0,
    bedrooms:
      parseNumberField(
        data.bedrooms,
        "bedrooms",
        existingProperty?.bedrooms ?? undefined
      ) ?? 0,
    bathrooms:
      parseNumberField(
        data.bathrooms,
        "bathrooms",
        existingProperty?.bathrooms ?? undefined
      ) ?? 0,
    parking: parseNumberField(
      data.parking,
      "parking",
      existingProperty?.parking ?? null
    ),
    furnished:
      data.furnished !== undefined
        ? Boolean(data.furnished)
        : existingProperty?.furnished ?? false,
    balcony:
      data.balcony !== undefined
        ? Boolean(data.balcony)
        : existingProperty?.balcony ?? false,
    elevator:
      data.elevator !== undefined
        ? Boolean(data.elevator)
        : existingProperty?.elevator ?? false,
    heating:
      data.heating !== undefined
        ? Boolean(data.heating)
        : existingProperty?.heating ?? false,
    phone: data.phone ?? existingProperty?.phone ?? null,
    status: data.status ?? existingProperty?.status ?? "available",
    googleMapsUrl:
      data.googleMapsUrl ?? existingProperty?.googleMapsUrl ?? null,
  };

  if (images.length > 0) {
    cleanData.images = images;
    cleanData.imageUrl = images[0];
  } else if (existingProperty) {
    cleanData.images = existingProperty.images ?? null;
    cleanData.imageUrl = existingProperty.imageUrl ?? null;
  } else {
    cleanData.images = null;
    cleanData.imageUrl = null;
  }

  return cleanData;
};

// Get all properties with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      city,
      neighborhood,
      listingType,
      minPrice,
      maxPrice,
      type,
      bedrooms,
      bathrooms,
      areaMin,
      areaMax,
      parking,
      furnished,
      balcony,
      elevator,
      heating,
      status,
    } = req.query;

    const propertyRepository = AppDataSource.getRepository(Property);
    const queryBuilder = propertyRepository.createQueryBuilder("property");

    // Apply filters
    const trimmedCity = typeof city === "string" ? city.trim() : "";
    if (trimmedCity) {
      queryBuilder.andWhere("LOWER(property.city) LIKE LOWER(:city)", {
        city: `%${trimmedCity}%`,
      });
    }

    const trimmedNeighborhood =
      typeof neighborhood === "string" ? neighborhood.trim() : "";
    if (trimmedNeighborhood) {
      queryBuilder.andWhere(
        "LOWER(property.neighborhood) LIKE LOWER(:neighborhood)",
        {
          neighborhood: `%${trimmedNeighborhood}%`,
        }
      );
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

    if (areaMin) {
      queryBuilder.andWhere("property.area >= :areaMin", {
        areaMin: Number(areaMin),
      });
    }

    if (areaMax) {
      queryBuilder.andWhere("property.area <= :areaMax", {
        areaMax: Number(areaMax),
      });
    }

    if (parking) {
      queryBuilder.andWhere("property.parking >= :parking", {
        parking: Number(parking),
      });
    }

    if (furnished === "true") {
      queryBuilder.andWhere("property.furnished = :furnished", {
        furnished: true,
      });
    }

    if (balcony === "true") {
      queryBuilder.andWhere("property.balcony = :balcony", {
        balcony: true,
      });
    }

    if (elevator === "true") {
      queryBuilder.andWhere("property.elevator = :elevator", {
        elevator: true,
      });
    }

    if (heating === "true") {
      queryBuilder.andWhere("property.heating = :heating", {
        heating: true,
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

// Get properties for the authenticated user
router.get("/my", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const propertyRepository = AppDataSource.getRepository(Property);
    const properties = await propertyRepository.find({
      where: { owner: { id: userId } },
      relations: ["owner"],
      order: { createdAt: "DESC" },
    });

    res.send(properties);
  } catch (error) {
    console.error("Error fetching user properties:", error);
    res.status(500).send({ error: "Failed to fetch your properties" });
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

    const propertyRepository = AppDataSource.getRepository(Property);

    const cleanData = preparePropertyData(propertyData, {
      requireImages: true,
    });

    const newProperty = propertyRepository.create({
      ...cleanData,
      owner: { id: userId },
    });

    const savedProperty = await propertyRepository.save(newProperty);

    res.status(201).send(savedProperty);
  } catch (error: any) {
    console.error("Error creating property:", error);
    const statusCode =
      error.message?.startsWith("Missing") ||
      error.message?.includes("image") ||
      error.message?.startsWith("Invalid")
        ? 400
        : 500;
    res.status(statusCode).send({
      error: error.message || "Failed to create property",
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

    if (property.owner.id !== userId) {
      return res.status(403).send({ error: "Forbidden" });
    }

    const cleanData = preparePropertyData(req.body, {
      requireImages: false,
      existingProperty: property,
    });

    Object.assign(property, cleanData);

    const updatedProperty = await propertyRepository.save(property);

    res.send(updatedProperty);
  } catch (error: any) {
    console.error("Error updating property:", error);
    const statusCode =
      error.message?.startsWith("Missing") ||
      error.message?.includes("image") ||
      error.message?.startsWith("Invalid")
        ? 400
        : 500;
    res.status(statusCode).send({
      error: error.message || "Failed to update property",
    });
  }
});

// Delete property (requires authentication)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
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

      if (property.owner.id !== userId) {
        return res.status(403).send({ error: "Forbidden" });
      }

      await propertyRepository.remove(property);

      res.send({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).send({ error: "Failed to delete property" });
    }
  }
);

export default router;
