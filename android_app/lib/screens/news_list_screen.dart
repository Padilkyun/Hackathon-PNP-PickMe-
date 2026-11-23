import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/news.dart';
import '../providers/news_provider.dart';
import '../utils/theme.dart';
import '../widgets/news_card.dart';
import 'news_detail_screen.dart';

enum NewsListMode { all, verified, unverified }

class NewsListScreen extends StatefulWidget {
  final NewsListMode mode;

  const NewsListScreen({super.key, required this.mode});

  @override
  State<NewsListScreen> createState() => _NewsListScreenState();
}

class _NewsListScreenState extends State<NewsListScreen> {
  @override
  Widget build(BuildContext context) {
    final titles = {
      NewsListMode.all: 'Semua Berita',
      NewsListMode.verified: 'Sudah Diverifikasi',
      NewsListMode.unverified: 'Belum Diverifikasi',
    };
    final subtitles = {
      NewsListMode.all: 'Diurutkan berdasarkan voting tertinggi',
      NewsListMode.verified: 'Hanya yang sudah diverifikasi admin',
      NewsListMode.unverified: 'Menunggu keputusan admin',
    };

    return Scaffold(
      appBar: AppBar(
        title: Text(titles[widget.mode]!),
      ),
      body: Consumer<NewsProvider>(
        builder: (context, provider, _) {
          List<News> items;
          switch (widget.mode) {
            case NewsListMode.all:
              items = provider.allNews;
              break;
            case NewsListMode.verified:
              items = provider.verifiedNews;
              break;
            case NewsListMode.unverified:
              items = provider.unverifiedNews;
              break;
          }

          if (provider.isLoading && items.isEmpty) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primary));
          }
          if (items.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.inbox_outlined, size: 64, color: AppTheme.textMuted.withValues(alpha: 0.5)),
                    const SizedBox(height: 12),
                    Text(
                      subtitles[widget.mode]!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 14),
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            color: AppTheme.primary,
            backgroundColor: AppTheme.surface,
            onRefresh: () => provider.loadAll(),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              physics: const AlwaysScrollableScrollPhysics(),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final news = items[index];
                return NewsCard(
                  news: news,
                  rank: widget.mode == NewsListMode.all ? index + 1 : 0,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => NewsDetailScreen(newsId: news.id)),
                  ),
                  onVote: () => provider.vote(news.id),
                );
              },
            ),
          );
        },
      ),
    );
  }
}