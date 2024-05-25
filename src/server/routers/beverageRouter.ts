import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "../prisma";

export const beverageRouter = router({
  getBeverages: procedure.query(async () => {
    const beverages = await prisma.beverage.findMany();

    return beverages;
  }),
});
