import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Favorite } from "../entity/favorite";
import { Property } from "../entity/property";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Get current user's favorite properties
router.get("/my", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) return res.status(401).send({ error: "Unauthorized" });

    const favoriteRepo = AppDataSource.getRepository(Favorite);
    const favorites = await favoriteRepo.find({
      where: { user: { id: userId } },
      relations: ["property", "property.owner"],
      order: { createdAt: "DESC" },
    });

    const properties = favorites.map((f) => f.property);
    res.send(properties);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).send({ error: "Failed to load favorites" });
  }
});

// Add favorite
router.post("/:propertyId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { propertyId } = req.params;
    if (!userId) return res.status(401).send({ error: "Unauthorized" });

    const propertyRepo = AppDataSource.getRepository(Property);
    const property = await propertyRepo.findOne({ where: { id: Number(propertyId) } });
    if (!property) return res.status(404).send({ error: "Property not found" });

    const favoriteRepo = AppDataSource.getRepository(Favorite);
    const existing = await favoriteRepo.findOne({
      where: { user: { id: userId }, property: { id: property.id } },
    });
    if (existing) return res.send({ ok: true });

    const fav = favoriteRepo.create({ user: { id: userId } as any, property: { id: property.id } as any });
    await favoriteRepo.save(fav);
    res.send({ ok: true });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).send({ error: "Failed to add favorite" });
  }
});

// Remove favorite
router.delete("/:propertyId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { propertyId } = req.params;
    if (!userId) return res.status(401).send({ error: "Unauthorized" });

    const favoriteRepo = AppDataSource.getRepository(Favorite);
    await favoriteRepo
      .createQueryBuilder()
      .delete()
      .where("userId = :userId AND propertyId = :propertyId", { userId, propertyId: Number(propertyId) })
      .execute();

    res.send({ ok: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).send({ error: "Failed to remove favorite" });
  }
});

export default router;


