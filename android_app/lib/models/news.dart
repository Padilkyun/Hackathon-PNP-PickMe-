enum NewsStatus { pending, reviewing, approved, rejected }

enum Sentiment { positive, neutral, negative }

enum NewsCategory { politik, ekonomi, sosial, teknologi, kesehatan, pendidikan, hukum, lainnya }

extension NewsCategoryLabel on NewsCategory {
  String get label {
    switch (this) {
      case NewsCategory.politik: return 'Politik';
      case NewsCategory.ekonomi: return 'Ekonomi';
      case NewsCategory.sosial: return 'Sosial';
      case NewsCategory.teknologi: return 'Teknologi';
      case NewsCategory.kesehatan: return 'Kesehatan';
      case NewsCategory.pendidikan: return 'Pendidikan';
      case NewsCategory.hukum: return 'Hukum';
      case NewsCategory.lainnya: return 'Lainnya';
    }
  }
}

class SentimentBreakdown {
  final int positive;
  final int neutral;
  final int negative;

  const SentimentBreakdown({
    required this.positive,
    required this.neutral,
    required this.negative,
  });

  factory SentimentBreakdown.uniform(Sentiment s) {
    switch (s) {
      case Sentiment.positive: return const SentimentBreakdown(positive: 75, neutral: 15, negative: 10);
      case Sentiment.negative: return const SentimentBreakdown(positive: 10, neutral: 20, negative: 70);
      case Sentiment.neutral: return const SentimentBreakdown(positive: 30, neutral: 50, negative: 20);
    }
  }
}

class News {
  final String id;
  final String title;
  final String excerpt;
  final String? url;
  final String source;
  final NewsCategory category;
  final String submittedBy;
  final DateTime submittedAt;
  final NewsStatus status;
  final Sentiment sentiment;
  final double sentimentScore;
  final SentimentBreakdown sentimentBreakdown;
  final int votes;
  final bool userVoted;
  final String? imageUrl;
  final String? verdict;

  const News({
    required this.id,
    required this.title,
    required this.excerpt,
    this.url,
    required this.source,
    required this.category,
    required this.submittedBy,
    required this.submittedAt,
    required this.status,
    required this.sentiment,
    required this.sentimentScore,
    required this.sentimentBreakdown,
    required this.votes,
    this.userVoted = false,
    this.imageUrl,
    this.verdict,
  });

  News copyWith({
    int? votes,
    bool? userVoted,
    NewsStatus? status,
    String? verdict,
  }) {
    return News(
      id: id,
      title: title,
      excerpt: excerpt,
      url: url,
      source: source,
      category: category,
      submittedBy: submittedBy,
      submittedAt: submittedAt,
      status: status ?? this.status,
      sentiment: sentiment,
      sentimentScore: sentimentScore,
      sentimentBreakdown: sentimentBreakdown,
      votes: votes ?? this.votes,
      userVoted: userVoted ?? this.userVoted,
      imageUrl: imageUrl,
      verdict: verdict ?? this.verdict,
    );
  }

  factory News.fromJson(Map<String, dynamic> json) {
    final sentiment = _sentimentFromString(json['sentiment'] as String? ?? 'neutral');
    return News(
      id: json['id'] as String,
      title: json['title'] as String,
      excerpt: json['excerpt'] as String? ?? '',
      url: json['url'] as String?,
      source: json['source'] as String? ?? '',
      category: _categoryFromString(json['category'] as String? ?? 'Lainnya'),
      submittedBy: json['submittedBy'] as String? ?? 'Anonim',
      submittedAt: DateTime.parse(json['submittedAt'] as String),
      status: _statusFromString(json['status'] as String? ?? 'pending'),
      sentiment: sentiment,
      sentimentScore: (json['sentimentScore'] as num?)?.toDouble() ?? 0.0,
      sentimentBreakdown: SentimentBreakdown.uniform(sentiment),
      votes: json['votes'] as int? ?? 0,
      userVoted: json['userVoted'] as bool? ?? false,
      imageUrl: json['imageUrl'] as String?,
      verdict: json['verdict'] as String?,
    );
  }

  static NewsStatus _statusFromString(String s) {
    switch (s) {
      case 'approved': return NewsStatus.approved;
      case 'rejected': return NewsStatus.rejected;
      case 'reviewing': return NewsStatus.reviewing;
      default: return NewsStatus.pending;
    }
  }

  static Sentiment _sentimentFromString(String s) {
    switch (s) {
      case 'positive': return Sentiment.positive;
      case 'negative': return Sentiment.negative;
      default: return Sentiment.neutral;
    }
  }

  static NewsCategory _categoryFromString(String s) {
    final lower = s.toLowerCase();
    for (final cat in NewsCategory.values) {
      if (cat.name == lower) return cat;
    }
    return NewsCategory.lainnya;
  }
}