import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "../prisma";
import { Beverage } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const beverageRouter = router({
  getBeverages: procedure.query(async () => {
    const beverages = await prisma.beverage.findMany();

    return beverages.map((b) => ({
      id: b.id,
      name: b.name,
      imageSourceUrl: b.imageSourceUrl,
      description: b.description,
      type: b.type,
      ingredients:
        b.ingredients == null || b.ingredients === ""
          ? []
          : b.ingredients.split(";"),
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

      if (req.input.beverages.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bare vælg et eller andet :-(",
        });
      }

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
  getOrders: procedure.query(async ({ ctx }) => {
    const orders = await prisma.order.findMany({
      include: {
        orderLines: {
          include: {
            beverage: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return orders;
  }),
  markOrderComplete: procedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input }) => {
      const order = await prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
      });

      if (order == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      if (order.status !== "PENDING") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Order is not pending",
        });
      }

      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "COMPLETED",
        },
      });
    }),
  markBeverageSoldOut: procedure
    .input(z.object({ beverageId: z.string() }))
    .mutation(async ({ input }) => {
      const beverage = await prisma.beverage.findUnique({
        where: {
          id: input.beverageId,
        },
      });

      if (beverage == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Beverage not found",
        });
      }

      await prisma.beverage.update({
        where: {
          id: beverage.id,
        },
        data: {
          quantity: 0,
        },
      });
    }),
});
