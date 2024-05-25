import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "../prisma";
import { Beverage } from "@prisma/client";

export const beverageRouter = router({
  getBeverages: procedure.query(async () => {
    const beverages = await prisma.beverage.findMany();

    return beverages.map((b) => ({
      id: b.id,
      name: b.name,
      imageSourceUrl: b.imageSourceUrl,
      description: b.description,
    }));
  }),
  createBeverageOrder: procedure
    .input(
      z.object({
        userName: z.string(),
        beverages: z.array(
          z.object({ beverageId: z.string(), quantity: z.number() }),
        ),
      }),
    )
    .mutation(async (req) => {
      const beverages = await prisma.beverage.findMany({
        where: {
          id: {
            in: req.input.beverages.map((b) => b.beverageId),
          },
        },
      });

      const beveragesById = beverages.reduce(
        (acc, b) => {
          acc[b.id] = b;
          return acc;
        },
        {} as Record<string, Beverage>,
      );

      req.input.beverages.forEach((b) => {
        if (beveragesById[b.beverageId] == null) {
          throw new Error(`Ugyldig drikkevare: ${b.beverageId}. Mystisk! 🤔`);
        }

        if (beveragesById[b.beverageId].quantity < b.quantity) {
          throw new Error(
            `Åh nej, vi har ikke nok ${beveragesById[b.beverageId].name}! 😢 (${
              beveragesById[b.beverageId].quantity <= 0
                ? "vi er løbet helt tør"
                : `vi har kun ${beveragesById[b.beverageId].quantity} tilbage`
            })`,
          );
        }
      });

      await prisma.$transaction([
        ...req.input.beverages.map((b) =>
          prisma.beverage.update({
            where: {
              id: b.beverageId,
            },
            data: {
              quantity: {
                decrement: b.quantity,
              },
            },
          }),
        ),
        prisma.order.create({
          data: {
            userId: req.input.userName,
            status: "PENDING",
            orderLines: {
              create: req.input.beverages.map((b) => ({
                beverageId: b.beverageId,
                quantity: b.quantity,
              })),
            },
          },
        }),
      ]);
    }),
  getPreviousOrders: procedure
    .input(z.object({ userName: z.string() }))
    .query(async (req) => {
      const orders = await prisma.order.findMany({
        where: {
          userId: req.input.userName,
        },
        include: {
          orderLines: {
            include: {
              beverage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return orders.map((o) => ({
        id: o.id,
        createdAt: o.createdAt,
        orderLines: o.orderLines.map((ol) => ({
          beverage: {
            id: ol.beverage.id,
            name: ol.beverage.name,
            imageSourceUrl: ol.beverage.imageSourceUrl,
          },
          quantity: ol.quantity,
        })),
      }));
    }),
});