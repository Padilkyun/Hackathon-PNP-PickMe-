import 'package:flutter/foundation.dart';
import '../models/news.dart';
import '../services/news_service.dart';

class NewsProvider extends ChangeNotifier {
  final NewsService _service = NewsService();

  List<News> _allNews = [];
  List<News> _verifiedNews = [];
  List<News> _unverifiedNews = [];
  bool _isLoading = false;
  String? _error;

  List<News> get allNews => _allNews;
  List<News> get verifiedNews => _verifiedNews;
  List<News> get unverifiedNews => _unverifiedNews;
  bool get isLoading => _isLoading;
  String? get error => _error;

  NewsProvider() {
    loadAll();
  }

  Future<void> loadAll() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _allNews = await _service.getSortedByVotes();
      _verifiedNews = await _service.getVerified();
      _unverifiedNews = await _service.getUnverified();
    } catch (e) {
      _error = 'Gagal memuat data: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> vote(String newsId) async {
    final idx = _allNews.indexWhere((n) => n.id == newsId);
    if (idx == -1) return;

    // Optimistic update
    final prev = _allNews[idx];
    _allNews[idx] = await _service.vote(newsId) ?? prev;
    notifyListeners();

    // Reload to keep lists in sync
    await loadAll();
  }

  Future<News?> submitNews({
    required String title,
    required String excerpt,
    required String category,
    required String url,
  }) async {
    try {
      final newNews = await _service.submit(
        title: title,
        excerpt: excerpt,
        category: category,
        url: url,
      );
      await loadAll();
      return newNews;
    } catch (e) {
      _error = 'Gagal mengirim laporan: $e';
      notifyListeners();
      return null;
    }
  }

  Future<News?> getById(String id) async {
    return _service.getById(id);
  }
}