import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users
   */
  async getAllUsers(limit = 50, offset = 0) {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Ban a user
   */
  async banUser(userId: string, reason?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'BANNED' },
    });
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: string, reason?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
    });
  }

  /**
   * Get all listings for moderation
   */
  async getPendingListings(limit = 50, offset = 0) {
    return this.prisma.listing.findMany({
      where: { moderationStatus: 'PENDING' },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Approve a listing
   */
  async approveListing(listingId: string) {
    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        moderationStatus: 'APPROVED',
        isModerated: true,
        moderatedAt: new Date(),
      },
    });
  }

  /**
   * Reject a listing
   */
  async rejectListing(listingId: string, reason: string) {
    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        moderationStatus: 'REJECTED',
        isModerated: true,
        moderationReason: reason,
        moderatedAt: new Date(),
      },
    });
  }

  /**
   * Get moderation reports
   */
  async getModerationReports(limit = 50, offset = 0) {
    return this.prisma.moderationReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Resolve a moderation report
   */
  async resolveModerationReport(
    reportId: string,
    action: string,
    notes?: string,
  ) {
    return this.prisma.moderationReport.update({
      where: { id: reportId },
      data: {
        status: 'APPROVED',
        resolvedAt: new Date(),
        action,
        notes,
      },
    });
  }

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics() {
    const totalUsers = await this.prisma.user.count();
    const totalListings = await this.prisma.listing.count({
      where: { deletedAt: null },
    });
    const totalPremiumUsers = await this.prisma.subscription.count({
      where: { plan: 'PREMIUM' },
    });
    const totalReviews = await this.prisma.review.count();

    return {
      totalUsers,
      totalListings,
      totalPremiumUsers,
      totalReviews,
    };
  }
}
