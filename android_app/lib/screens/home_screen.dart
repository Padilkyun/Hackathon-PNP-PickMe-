import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/news_provider.dart';
import '../utils/theme.dart';
import 'news_list_screen.dart';
import 'submit_screen.dart';
import 'news_detail_screen.dart';
import '../widgets/news_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          color: AppTheme.primary,
          backgroundColor: AppTheme.surface,
          onRefresh: () => context.read<NewsProvider>().loadAll(),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              _buildHeader(),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    const SizedBox(height: 16),
                    _StatsRow(),
                    const SizedBox(height: 24),
                    _SectionTitle(
                      title: 'Prioritas Voting',
                      subtitle: 'Berita dengan voting tertinggi',
                      actionText: 'Lihat Semua',
                      onAction: () => _openList(context, NewsListMode.all),
                    ),
                    const SizedBox(height: 12),
                    _TopVotingList(),
                    const SizedBox(height: 24),
                    _SectionTitle(
                      title: 'Sudah Diverifikasi',
                      subtitle: 'Status resmi dari admin',
                      actionText: 'Lihat Semua',
                      onAction: () => _openList(context, NewsListMode.verified),
                    ),
                    const SizedBox(height: 12),
                    _VerifiedList(),
                    const SizedBox(height: 24),
                    _SectionTitle(
                      title: 'Belum Diverifikasi',
                      subtitle: 'Menunggu review admin',
                      actionText: 'Lihat Semua',
                      onAction: () => _openList(context, NewsListMode.unverified),
                    ),
                    const SizedBox(height: 12),
                    _UnverifiedList(),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openSubmit(context),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.black,
        elevation: 0,
        icon: const Icon(Icons.report_outlined),
        label: const Text('Lapor Berita', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
    );
  }

  void _openList(BuildContext context, NewsListMode mode) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => NewsListScreen(mode: mode)),
    );
  }

  void _openSubmit(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const SubmitScreen()),
    );
  }

  void _openDetail(BuildContext context, String id) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => NewsDetailScreen(newsId: id)),
    );
  }

  SliverToBoxAdapter _buildHeader() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'PICKME',
                      style: TextStyle(
                        color: AppTheme.primarySoft,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'GARUDA',
                      style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: const Icon(Icons.notifications_outlined, color: AppTheme.textPrimary, size: 22),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text(
              'Verifikasi Berita\nuntuk Indonesia',
              style: TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 24,
                fontWeight: FontWeight.w800,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Laporkan berita, vote untuk yang prioritas, dan lihat hasil verifikasi resmi.',
              style: TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 13,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final String subtitle;
  final String? actionText;
  final VoidCallback? onAction;

  const _SectionTitle({
    required this.title,
    required this.subtitle,
    this.actionText,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(
                  color: AppTheme.textMuted,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
        if (actionText != null && onAction != null)
          TextButton(
            onPressed: onAction,
            child: Text(actionText!),
          ),
      ],
    );
  }
}

class _StatsRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<NewsProvider>(
      builder: (context, provider, _) {
        final total = provider.allNews.length;
        final verified = provider.verifiedNews.length;
        final unverified = provider.unverifiedNews.length;
        return Row(
          children: [
            Expanded(child: _StatBox(label: 'Total', value: '$total', color: AppTheme.primary)),
            const SizedBox(width: 12),
            Expanded(child: _StatBox(label: 'Verified', value: '$verified', color: AppTheme.positive)),
            const SizedBox(width: 12),
            Expanded(child: _StatBox(label: 'Pending', value: '$unverified', color: AppTheme.neutral)),
          ],
        );
      },
    );
  }
}

class _StatBox extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatBox({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppTheme.textMuted,
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 24,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}

class _TopVotingList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<NewsProvider>(
      builder: (context, provider, _) {
        final items = provider.allNews.take(3).toList();
        if (provider.isLoading && items.isEmpty) {
          return const _LoadingPlaceholder();
        }
        return Column(
          children: [
            for (int i = 0; i < items.length; i++)
              Padding(
                padding: EdgeInsets.only(bottom: i < items.length - 1 ? 12 : 0),
                child: NewsCard(
                  news: items[i],
                  rank: i + 1,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => NewsDetailScreen(newsId: items[i].id)),
                  ),
                  onVote: () => provider.vote(items[i].id),
                ),
              ),
          ],
        );
      },
    );
  }
}

class _VerifiedList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<NewsProvider>(
      builder: (context, provider, _) {
        final items = provider.verifiedNews.take(2).toList();
        if (items.isEmpty) return const _EmptyState(text: 'Belum ada berita terverifikasi.');
        return Column(
          children: [
            for (int i = 0; i < items.length; i++)
              Padding(
                padding: EdgeInsets.only(bottom: i < items.length - 1 ? 12 : 0),
                child: NewsCard(
                  news: items[i],
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => NewsDetailScreen(newsId: items[i].id)),
                  ),
                  onVote: () => provider.vote(items[i].id),
                ),
              ),
          ],
        );
      },
    );
  }
}

class _UnverifiedList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<NewsProvider>(
      builder: (context, provider, _) {
        final items = provider.unverifiedNews.take(2).toList();
        if (items.isEmpty) return const _EmptyState(text: 'Tidak ada berita menunggu verifikasi.');
        return Column(
          children: [
            for (int i = 0; i < items.length; i++)
              Padding(
                padding: EdgeInsets.only(bottom: i < items.length - 1 ? 12 : 0),
                child: NewsCard(
                  news: items[i],
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => NewsDetailScreen(newsId: items[i].id)),
                  ),
                  onVote: () => provider.vote(items[i].id),
                ),
              ),
          ],
        );
      },
    );
  }
}

class _LoadingPlaceholder extends StatelessWidget {
  const _LoadingPlaceholder();
  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 24),
      child: Center(child: CircularProgressIndicator(color: AppTheme.primary)),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String text;
  const _EmptyState({required this.text});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border),
      ),
      child: Text(text, style: const TextStyle(color: AppTheme.textMuted, fontSize: 13)),
    );
  }
}