import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/news.dart';
import '../utils/theme.dart';

class NewsCard extends StatelessWidget {
  final News news;
  final VoidCallback onTap;
  final VoidCallback onVote;
  final int rank;

  const NewsCard({
    super.key,
    required this.news,
    required this.onTap,
    required this.onVote,
    this.rank = 0,
  });

  Color get statusColor {
    switch (news.status) {
      case NewsStatus.approved: return AppTheme.positive;
      case NewsStatus.rejected: return AppTheme.negative;
      case NewsStatus.reviewing: return Colors.blue;
      case NewsStatus.pending: return AppTheme.neutral;
    }
  }

  Color get sentimentColor {
    switch (news.sentiment) {
      case Sentiment.positive: return AppTheme.positive;
      case Sentiment.negative: return AppTheme.negative;
      case Sentiment.neutral: return AppTheme.neutral;
    }
  }

  IconData get statusIcon {
    switch (news.status) {
      case NewsStatus.approved: return Icons.check_circle;
      case NewsStatus.rejected: return Icons.cancel;
      case NewsStatus.reviewing: return Icons.visibility;
      case NewsStatus.pending: return Icons.access_time;
    }
  }

  String get statusLabel {
    switch (news.status) {
      case NewsStatus.approved: return 'Terverifikasi';
      case NewsStatus.rejected: return 'Ditolak';
      case NewsStatus.reviewing: return 'Direview';
      case NewsStatus.pending: return 'Menunggu';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (news.imageUrl != null)
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceElevated,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: news.imageUrl!.startsWith('assets/')
                        ? Image.asset(
                            news.imageUrl!,
                            fit: BoxFit.cover,
                          )
                        : Image.network(
                            news.imageUrl!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Center(
                              child: Icon(Icons.image_not_supported_outlined,
                                  color: AppTheme.textMuted),
                            ),
                          ),
                  ),
                ),
              const SizedBox(height: 12),
              Row(
                children: [
                  if (rank > 0) ...[
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: rank <= 3
                            ? AppTheme.primary.withValues(alpha: 0.1)
                            : AppTheme.surfaceElevated,
                        shape: BoxShape.circle,
                        border: rank <= 3
                            ? Border.all(color: AppTheme.primary.withValues(alpha: 0.3))
                            : null,
                      ),
                      child: Center(
                        child: Text(
                          '$rank',
                          style: TextStyle(
                            color: rank <= 3 ? AppTheme.primarySoft : AppTheme.textSecondary,
                            fontWeight: FontWeight.w700,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                  ],
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: statusColor.withValues(alpha: 0.2)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(statusIcon, color: statusColor, size: 12),
                          const SizedBox(width: 3),
                          Text(
                            statusLabel,
                            style: TextStyle(
                              color: statusColor,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Text(
                    news.category.label,
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    news.title,
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      height: 1.3,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    news.excerpt,
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 12,
                      height: 1.4,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          news.source,
                          style: const TextStyle(
                            color: AppTheme.textMuted,
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Icon(Icons.bolt, color: sentimentColor, size: 10),
                            const SizedBox(width: 2),
                            Text(
                              '${news.sentiment.name.toUpperCase()} ${(news.sentimentScore.abs() * 100).toStringAsFixed(0)}%',
                              style: TextStyle(
                                color: sentimentColor,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  _VoteButton(
                    votes: news.votes,
                    voted: news.userVoted,
                    onTap: onVote,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.05, end: 0);
  }
}

class _VoteButton extends StatelessWidget {
  final int votes;
  final bool voted;
  final VoidCallback onTap;

  const _VoteButton({required this.votes, required this.voted, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: voted
                ? AppTheme.primary.withValues(alpha: 0.1)
                : AppTheme.surfaceElevated,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: voted
                  ? AppTheme.primary.withValues(alpha: 0.3)
                  : AppTheme.border,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                voted ? Icons.thumb_up : Icons.thumb_up_outlined,
                color: voted ? AppTheme.primarySoft : AppTheme.textSecondary,
                size: 14,
              ),
              const SizedBox(width: 4),
              Text(
                '$votes',
                style: TextStyle(
                  color: voted ? AppTheme.primarySoft : AppTheme.textPrimary,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}