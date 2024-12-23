'use server';

import { drizzle } from '@/db';

export async function createOne(userId: string, imageId: string) {
  return await drizzle.imageStats.insertImageStat({
    imageId,
    isResolved: false,
    numberOfTries: 0,
    userId,
  });
}

export async function getByUniquePair(userId: string, imageId: string) {
  return await drizzle.imageStats.findImageStatByConstraint(userId, imageId);
}

export async function getUserHistory(userId: string) {
  return await drizzle.imageStats.findImageStatsHistoryByUserId(userId);
}

export async function resolveImage(id: string) {
  return await drizzle.imageStats.resolveImageStat(id);
}

export async function setNumberOfTries(id: string, numberOfTries: number) {
  return await drizzle.imageStats.updateImageStatNumberOfTries(
    id,
    numberOfTries
  );
}
