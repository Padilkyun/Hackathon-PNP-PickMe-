import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/news.dart';
import '../providers/news_provider.dart';
import '../utils/theme.dart';

class NewsDetailScreen extends StatefulWidget {
  final String newsId;

  const NewsDetailScreen({super.key, required this.newsId});

  @override
  State<NewsDetailScreen> createState() => _NewsDetailScreenState();
}

class _NewsDetailScreenState extends State<NewsDetailScreen> {
  News? _news;

  @override
  void initState() {
    super.initState();
    _loadNews();
  }

  Future<void> _loadNews() async {
    final news = await context.read<NewsProvider>().getById(widget.newsId);
    if (mounted) setState(() => _news = news);
  }

  Color get statusColor {
    if (_news == null) return AppTheme.textMuted;
    switch (_news!.status) {
      case NewsStatus.approved: return AppTheme.positive;
      case NewsStatus.rejected: return AppTheme.negative;
      case NewsStatus.reviewing: return Colors.blue;
      case NewsStatus.pending: return AppTheme.neutral;
    }
  }

  Color get sentimentColor {
    if (_news == null) return AppTheme.textMuted;
    switch (_news!.sentiment) {
      case Sentiment.positive: return AppTheme.positive;
      case Sentiment.negative: return AppTheme.negative;
      case Sentiment.neutral: return AppTheme.neutral;
    }
  }

  IconData get statusIcon {
    if (_news == null) return Icons.help_outline;
    switch (_news!.status) {
      case NewsStatus.approved: return Icons.check_circle;
      case NewsStatus.rejected: return Icons.cancel;
      case NewsStatus.reviewing: return Icons.visibility;
      case NewsStatus.pending: return Icons.access_time;
    }
  }

  String get statusLabel {
    if (_news == null) return '—';
    switch (_news!.status) {
      case NewsStatus.approved: return 'Terverifikasi';
      case NewsStatus.rejected: return 'Ditolak';
      case NewsStatus.reviewing: return 'Direview Admin';
      case NewsStatus.pending: return 'Menunggu Review';
    }
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _handleVote() {
    context.read<NewsProvider>().vote(widget.newsId);
    _loadNews();
  }

  @override
  Widget build(BuildContext context) {
    if (_news == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Berita')),
        body: const Center(child: CircularProgressIndicator(color: AppTheme.primary)),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail Berita'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: () {
              // Share functionality
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            if (_news!.imageUrl != null)
              _buildDetailImage(_news!.imageUrl!),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Status & category
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: statusColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: statusColor.withValues(alpha: 0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(statusIcon, color: statusColor, size: 16),
                            const SizedBox(width: 6),
                            Text(
                              statusLabel,
                              style: TextStyle(
                                color: statusColor,
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceElevated,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.border),
                        ),
                        child: Text(
                          _news!.category,
                          style: const TextStyle(
                            color: AppTheme.textSecondary,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Title
                  Text(
                    _news!.title,
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      height: 1.3,
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Source + date
                  Row(
                    children: [
                      Icon(Icons.source_outlined, size: 14, color: AppTheme.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        _news!.source,
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                      ),
                      const SizedBox(width: 12),
                      Icon(Icons.access_time, size: 14, color: AppTheme.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        _formatDate(_news!.submittedAt),
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Sentiment
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: sentimentColor.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: sentimentColor.withValues(alpha: 0.25)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.bolt, color: sentimentColor, size: 18),
                            const SizedBox(width: 8),
                            Text(
                              'Analisis Sentimen',
                              style: TextStyle(
                                color: sentimentColor,
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const Spacer(),
                            Text(
                              '${(_news!.sentimentScore.abs() * 100).toStringAsFixed(0)}%',
                              style: TextStyle(
                                color: sentimentColor,
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _SentimentBar(
                                color: AppTheme.positive,
                                percentage: _news!.sentimentBreakdown.positive,
                                label: 'Positif',
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _SentimentBar(
                                color: AppTheme.neutral,
                                percentage: _news!.sentimentBreakdown.neutral,
                                label: 'Netral',
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _SentimentBar(
                                color: AppTheme.negative,
                                percentage: _news!.sentimentBreakdown.negative,
                                label: 'Negatif',
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Content
                  const Text(
                    'Ringkasan',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _news!.excerpt,
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 15,
                      height: 1.6,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Verdict if approved/rejected
                  if (_news!.verdict != null) ...[
                    const Text(
                      'Keputusan Admin',
                      style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: statusColor.withValues(alpha: 0.25)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(statusIcon, color: statusColor, size: 18),
                              const SizedBox(width: 8),
                              Text(
                                statusLabel,
                                style: TextStyle(
                                  color: statusColor,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _news!.verdict!,
                            style: const TextStyle(
                              color: AppTheme.textSecondary,
                              fontSize: 14,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Source link
                  if (_news!.url != null) ...[
                    const Text(
                      'Sumber Asli',
                      style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton.icon(
                      onPressed: () => _launchUrl(_news!.url!),
                      icon: const Icon(Icons.open_in_new),
                      label: const Text('Buka Artikel Asli'),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Vote button
                  Consumer<NewsProvider>(
                    builder: (context, provider, _) {
                      final currentNews = provider.allNews.firstWhere(
                        (n) => n.id == _news!.id,
                        orElse: () => _news!,
                      );
                      return SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: _handleVote,
                          style: FilledButton.styleFrom(
                            backgroundColor: currentNews.userVoted
                                ? AppTheme.primary
                                : AppTheme.surfaceElevated,
                            foregroundColor: currentNews.userVoted
                                ? Colors.black
                                : AppTheme.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(
                                color: currentNews.userVoted
                                    ? Colors.transparent
                                    : AppTheme.primary,
                              ),
                            ),
                          ),
                          icon: Icon(
                            currentNews.userVoted
                                ? Icons.thumb_up
                                : Icons.thumb_up_outlined,
                          ),
                          label: Text(
                            'Vote (${currentNews.votes})',
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inHours < 1) return '${diff.inMinutes}m lalu';
    if (diff.inHours < 24) return '${diff.inHours}j lalu';
    if (diff.inDays < 7) return '${diff.inDays}h lalu';
    return '${date.day}/${date.month}/${date.year}';
  }

  Widget _buildDetailImage(String imageUrl) {
    if (imageUrl.startsWith('assets/')) {
      return Image.asset(
        imageUrl,
        width: double.infinity,
        height: 220,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const SizedBox.shrink(),
      );
    }
    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: double.infinity,
      height: 220,
      fit: BoxFit.cover,
      placeholder: (_, __) => Container(
        height: 220,
        color: AppTheme.surfaceElevated,
        child: const Center(child: CircularProgressIndicator(color: AppTheme.primary, strokeWidth: 2)),
      ),
      errorWidget: (_, __, ___) => const SizedBox.shrink(),
    );
  }
}

class _SentimentBar extends StatelessWidget {
  final Color color;
  final int percentage;
  final String label;

  const _SentimentBar({required this.color, required this.percentage, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 4),
        Stack(
          children: [
            Container(
              height: 6,
              decoration: BoxDecoration(
                color: AppTheme.surfaceElevated,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
            FractionallySizedBox(
              widthFactor: percentage / 100,
              child: Container(
                height: 6,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}