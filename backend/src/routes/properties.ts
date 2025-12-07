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
    // Extended attributes
    availableFrom: data.availableFrom
      ? new Date(data.availableFrom)
      : existingProperty?.availableFrom ?? null,
    leaseTermMonths: parseNumberField(
      data.leaseTermMonths,
      "leaseTermMonths",
      existingProperty?.leaseTermMonths ?? null
    ),
    depositAmount: parseNumberField(
      data.depositAmount,
      "depositAmount",
      existingProperty?.depositAmount ?? null
    ),
    utilitiesIncluded:
      data.utilitiesIncluded !== undefined
        ? Boolean(data.utilitiesIncluded)
        : existingProperty?.utilitiesIncluded ?? false,
    petFriendly:
      data.petFriendly !== undefined
        ? Boolean(data.petFriendly)
        : existingProperty?.petFriendly ?? false,
    smokingAllowed:
      data.smokingAllowed !== undefined
        ? Boolean(data.smokingAllowed)
        : existingProperty?.smokingAllowed ?? false,
    floor: parseNumberField(
      data.floor,
      "floor",
      existingProperty?.floor ?? null
    ),
    totalFloors: parseNumberField(
      data.totalFloors,
      "totalFloors",
      existingProperty?.totalFloors ?? null
    ),
    yearBuilt: parseNumberField(
      data.yearBuilt,
      "yearBuilt",
      existingProperty?.yearBuilt ?? null
    ),
    energyClass: data.energyClass ?? existingProperty?.energyClass ?? null,
    heatingType: data.heatingType ?? existingProperty?.heatingType ?? null,
    parkingType: data.parkingType ?? existingProperty?.parkingType ?? null,
    airConditioning:
      data.airConditioning !== undefined
        ? Boolean(data.airConditioning)
        : existingProperty?.airConditioning ?? false,
    garden:
      data.garden !== undefined
        ? Boolean(data.garden)
        : existingProperty?.garden ?? false,
    storage:
      data.storage !== undefined
        ? Boolean(data.storage)
        : existingProperty?.storage ?? false,
    phone: data.phone ?? existingProperty?.phone ?? null,
    status: data.status ?? existingProperty?.status ?? "available",
    googleMapsUrl:
      data.googleMapsUrl ?? existingProperty?.googleMapsUrl ?? null,
  };

  // Auto-calc rentedUntil on create/update based on leaseTermMonths when status is 'rented'
  try {
    const effectiveStatus = cleanData.status;
    const monthsVal =
      typeof cleanData.leaseTermMonths === "number"
        ? cleanData.leaseTermMonths
        : null;
    if (effectiveStatus === "rented" && monthsVal && monthsVal > 0) {
      const start =
        cleanData.availableFrom instanceof Date &&
        !Number.isNaN(cleanData.availableFrom.getTime())
          ? cleanData.availableFrom
          : new Date();
      const until = new Date(start);
      until.setMonth(until.getMonth() + monthsVal);
      (cleanData as any).rentedUntil = until;
    } else if (effectiveStatus !== "rented") {
      (cleanData as any).rentedUntil = null;
    }
  } catch {}

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
/**
 * @openapi
 * /properties:
 *   get:
 *     tags: [Properties]
 *     summary: List properties with optional filters
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: neighborhood
 *         schema: { type: string }
 *       - in: query
 *         name: listingType
 *         schema: { type: string, enum: [rent, buy] }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [house, apartment, studio, land, commercial] }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Array of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Property' }
 */
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
/**
 * @openapi
 * /properties/my:
 *   get:
 *     tags: [Properties]
 *     summary: List properties of current user
 *     responses:
 *       200:
 *         description: Array of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Property' }
 *       401: { description: Unauthorized }
 */
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
/**
 * @openapi
 * /properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get a property by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Property
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404: { description: Property not found }
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const propertyRepository = AppDataSource.getRepository(Property);

    let property = await propertyRepository.findOne({
      where: { id: Number(id) },
      relations: ["owner"],
    });

    if (!property) {
      return res.status(404).send({ error: "Property not found" });
    }

    // Increment views (best-effort; ignore errors)
    try {
      await propertyRepository
        .createQueryBuilder()
        .update(Property)
        .set({ viewsCount: () => `"viewsCount" + 1` })
        .where("id = :id", { id: Number(id) })
        .execute();
      property.viewsCount += 1;
    } catch {}

    res.send(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).send({ error: "Failed to fetch property" });
  }
});

// Create new property (requires authentication)
/**
 * @openapi
 * /properties:
 *   post:
 *     tags: [Properties]
 *     summary: Create a new property
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyCreateRequest'
 *     responses:
 *       201:
 *         description: Created property
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
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
/**
 * @openapi
 * /properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: Update an existing property
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyUpdateRequest'
 *     responses:
 *       200:
 *         description: Updated property
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Property not found }
 */
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

// Update status (sold / rented); if rented and months provided, set rentedUntil
router.patch(
  "/:id/status",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, months } = req.body || {};
      const userId = (req as AuthRequest).user?.userId;
      if (!userId) return res.status(401).send({ error: "Unauthorized" });

      const propertyRepository = AppDataSource.getRepository(Property);
      const property = await propertyRepository.findOne({
        where: { id: Number(id) },
        relations: ["owner"],
      });
      if (!property)
        return res.status(404).send({ error: "Property not found" });
      if (property.owner.id !== userId)
        return res.status(403).send({ error: "Forbidden" });

      if (
        !["available", "sold", "rented", "pending"].includes(String(status))
      ) {
        return res.status(400).send({ error: "Invalid status" });
      }

      // Listing-type sanity checks
      if (status === "sold" && property.listingType !== "buy") {
        return res
          .status(400)
          .send({ error: "Only 'buy' listings can be marked as sold" });
      }
      if (status === "rented" && property.listingType !== "rent") {
        return res
          .status(400)
          .send({ error: "Only 'rent' listings can be marked as rented" });
      }

      property.status = status;
      if (status === "rented") {
        const m =
          Number(months) > 0
            ? Number(months)
            : property.leaseTermMonths && Number(property.leaseTermMonths) > 0
            ? Number(property.leaseTermMonths)
            : 0;

        if (m > 0) {
          const start = new Date();
          const until = new Date(start);
          until.setMonth(until.getMonth() + m);
          property.rentedUntil = until;
        } else {
          property.rentedUntil = null;
        }
      } else if (status !== "rented") {
        property.rentedUntil = null;
      }

      const saved = await propertyRepository.save(property);
      res.send(saved);
    } catch (error) {
      console.error("Error updating property status:", error);
      res.status(500).send({ error: "Failed to update status" });
    }
  }
);

// Delete property (requires authentication)
/**
 * @openapi
 * /properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete a property
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Property deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Property not found }
 */
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
