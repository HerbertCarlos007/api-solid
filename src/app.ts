import fastify from "fastify";
import { z } from 'zod'
import { PrismaClient } from "@prisma/client";

export const app = fastify();

