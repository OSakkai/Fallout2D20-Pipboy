#!/bin/bash

# Start Prisma Studio in background
npx prisma studio --port 5555 --hostname 0.0.0.0 &

# Start the NestJS application
npm run start:dev
