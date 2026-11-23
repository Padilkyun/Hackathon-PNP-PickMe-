import 'dart:math';
import '../models/news.dart';

/// NewsService — currently uses mock local data.
/// In a production implementation, replace with HTTP client calls to a backend API.
class NewsService {
  static final List<News> _mockData = _seedMockData();

  // Cache of voted news ids per user (in-memory; persist via shared_preferences in a real app)
  static final Set<String> _votedIds = {};

  Future<List<News>> getAll() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockData.map((n) => n.copyWith(userVoted: _votedIds.contains(n.id))).toList();
  }

  Future<List<News>> getVerified() async {
    final all = await getAll();
    return all.where((n) => n.status == NewsStatus.approved || n.status == NewsStatus.rejected).toList();
  }

  Future<List<News>> getUnverified() async {
    final all = await getAll();
    return all.where((n) => n.status == NewsStatus.pending || n.status == NewsStatus.reviewing).toList();
  }

  /// Sort by votes DESC (highest priority = most votes)
  Future<List<News>> getSortedByVotes({bool verifiedOnly = false}) async {
    final list = verifiedOnly ? await getVerified() : await getAll();
    list.sort((a, b) => b.votes.compareTo(a.votes));
    return list;
  }

  Future<News?> getById(String id) async {
    final all = await getAll();
    try {
      return all.firstWhere((n) => n.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Vote for a news item. Each user may only vote once per item.
  Future<News?> vote(String id) async {
    final idx = _mockData.indexWhere((n) => n.id == id);
    if (idx == -1) return null;
    final current = _mockData[idx];
    if (_votedIds.contains(id)) {
      // Unvote (toggle)
      _votedIds.remove(id);
      final updated = current.copyWith(votes: max(0, current.votes - 1), userVoted: false);
      _mockData[idx] = updated;
      return updated;
    }
    _votedIds.add(id);
    final updated = current.copyWith(votes: current.votes + 1, userVoted: true);
    _mockData[idx] = updated;
    return updated;
  }

  /// Submit a new news report (enters as pending).
  Future<News> submit({
    required String title,
    required String excerpt,
    required String category,
    required String url,
    String submittedBy = 'Anda',
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final sentiment = Sentiment.neutral;
    final newNews = News(
      id: 'local-${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      excerpt: excerpt,
      url: url.isEmpty ? null : url,
      source: 'Laporan Pengguna',
      category: NewsCategory.values.firstWhere(
        (c) => c.name == category.toLowerCase(),
        orElse: () => NewsCategory.lainnya,
      ),
      submittedBy: submittedBy,
      submittedAt: DateTime.now(),
      status: NewsStatus.pending,
      sentiment: sentiment,
      sentimentScore: 0.0,
      sentimentBreakdown: SentimentBreakdown.uniform(sentiment),
      votes: 1,
      imageUrl: null,
    );
    _mockData.insert(0, newNews);
    _votedIds.add(newNews.id);
    return newNews;
  }

  static List<News> _seedMockData() {
    final now = DateTime.now();
    return [
      News(
        id: 'n1',
        title: 'Vaksin baru 100% aman menurut dokter terkenal',
        excerpt: 'Klaim keamanan absolut dari seorang dokter viral di media sosial. Perlu klarifikasi dari BPOM.',
        url: 'https://contoh-berita.id/vaksin-aman',
        source: 'Kesehatan Viral',
        category: NewsCategory.kesehatan,
        submittedBy: 'sari@email.com',
        submittedAt: now.subtract(const Duration(hours: 3)),
        status: NewsStatus.reviewing,
        sentiment: Sentiment.positive,
        sentimentScore: 0.55,
        sentimentBreakdown: SentimentBreakdown.uniform(Sentiment.positive),
        votes: 142,
        imageUrl: 'assets/images/login-portrait.png',
      ),
      News(
        id: 'n2',
        title: 'BBM subsidi resmi naik 30% mulai besok',
        excerpt: 'Rumor kenaikan harga BBM kembali ramai, mohon verifikasi dari ESDM.',
        url: 'https://contoh-berita.id/bbm-naik',
        source: 'Ekonomi Watch',
        category: NewsCategory.ekonomi,
        submittedBy: 'budi@email.com',
        submittedAt: now.subtract(const Duration(hours: 1)),
        status: NewsStatus.pending,
        sentiment: Sentiment.negative,
        sentimentScore: -0.72,
        sentimentBreakdown: SentimentBreakdown.uniform(Sentiment.negative),
        votes: 89,
        imageUrl: 'assets/images/login.png',
      ),
      News(
        id: 'n3',
        title: 'Timnas Indonesia menang telak 5-0',
        excerpt: 'Kemenangan telak di kualifikasi piala dunia.',
        url: 'https://contoh-berita.id/timnas-menang',
        source: 'Sport.id',
        category: NewsCategory.lainnya, // sport not defined
        submittedBy: 'doni@email.com',
        submittedAt: now.subtract(const Duration(hours: 18)),
        status: NewsStatus.approved,
        sentiment: Sentiment.positive,
        sentimentScore: 0.88,
        sentimentBreakdown: SentimentBreakdown.uniform(Sentiment.positive),
        votes: 245,
        verdict: 'Dikonfirmasi oleh PSSI.',
        imageUrl: 'assets/images/login-landscape.png',
      ),
      News(
        id: 'n4',
        title: 'Artis terkenal ditangkap polisi — HOAKS',
        excerpt: 'Kabar penangkapan tanpa bukti dari sumber tidak jelas.',
        url: 'https://contoh-berita.id/artis-ditangkap',
        source: 'Tabloid X',
        category: NewsCategory.lainnya, // hiburan not defined
        submittedBy: 'anonymous',
        submittedAt: now.subtract(const Duration(hours: 12)),
        status: NewsStatus.rejected,
        sentiment: Sentiment.neutral,
        sentimentScore: 0.05,
        sentimentBreakdown: SentimentBreakdown.uniform(Sentiment.neutral),
        votes: 67,
        verdict: 'Tidak ada konfirmasi polisi. Sumber tidak kredibel.',
        imageUrl: 'assets/images/login-left.png',
      ),
      News(
        id: 'n5',
        title: 'Banjir besar landa Jakarta, 12 kelurahan terendam',
        excerpt: 'BPBD DKI melaporkan ketinggian 30-100 cm.',
        url: 'https://contoh-berita.id/banjir-jkt',
        source: 'Metro News',
        category: NewsCategory.lainnya, // bencana not defined
        submittedBy: 'eko@email.com',
        submittedAt: now.subtract(const Duration(hours: 6)),
        status: NewsStatus.approved,
        sentiment: Sentiment.negative,
        sentimentScore: -0.45,
        sentimentBreakdown: SentimentBreakdown.uniform(Sentiment.negative),
        votes: 198,
        verdict: 'Dikonfirmasi BMKG dan BPBD DKI.',
        imageUrl: 'assets/images/layer.png',
      ),
      News(
        id: 'n6',
        title: 'Gempa 7.2 magnitudo guncang Sumatera Barat',
        excerpt: 'Gempa kuat dirasakan di 3 provinsi.',
        url: 'https://contoh-berita.id/gempa-sumbar',
        source: 'BMKG',
        category: NewsCategory.lainnya, // bencana fallback
        submittedBy: 'rilis@bmkg.go.id',
        submittedAt: now.subtract(const Duration(hours: 24)),
        status: NewsStatus.approved,
        sentiment: Sentiment.negative,
        sentimentScore: -0.81,
        sentimentBreakdown: SentimentBreakdown.uniform(Sentiment.negative),
        votes: 312,
        verdict: 'Sumber resmi BMKG.',
        imageUrl: 'assets/images/login-portrait.png',
      ),
      News(
        id: 'n7',
        title: 'Pemerintah akan bagi-bagi kuota internet gratis',
        excerpt: 'Informasi viral tentang kuota gratis, mohon verifikasi Kominfo.',
        url: 'https://contoh-berita.id/kuota-gratis',
        source: 'Netizen',
        category: NewsCategory.teknologi,
        submittedBy: 'fani@email.com',
        submittedAt: now.subtract(const Duration(hours: 8)),
        status: NewsStatus.pending,
        sentiment: Sentiment.positive,
        sentimentScore: 0.62,
        sentimentBreakdown: SentimentBreakdown.uniform(Sentiment.positive),
        votes: 54,
        imageUrl: 'assets/images/login.png',
      ),
    ];
  }
}
