import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/news.dart';
import '../providers/news_provider.dart';
import '../utils/theme.dart';

class SubmitScreen extends StatefulWidget {
  const SubmitScreen({super.key});

  @override
  State<SubmitScreen> createState() => _SubmitScreenState();
}

class _SubmitScreenState extends State<SubmitScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _sourceController = TextEditingController();
  final _urlController = TextEditingController();
  final _excerptController = TextEditingController();

  NewsCategory _selectedCategory = NewsCategory.politik;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _sourceController.dispose();
    _urlController.dispose();
    _excerptController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      await context.read<NewsProvider>().submitNews(
        title: _titleController.text.trim(),
        source: _sourceController.text.trim(),
        url: _urlController.text.trim().isEmpty ? null : _urlController.text.trim(),
        excerpt: _excerptController.text.trim(),
        category: _selectedCategory.name,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Laporan berita berhasil dikirim! Menunggu verifikasi admin.'),
            backgroundColor: AppTheme.positive,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Gagal mengirim laporan: $e'),
            backgroundColor: AppTheme.negative,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lapor Berita'),
        centerTitle: true,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header info
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.primary.withValues(alpha: 0.25)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.info_outline, color: AppTheme.primarySoft, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          'Panduan Laporan',
                          style: TextStyle(
                            color: AppTheme.primarySoft,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Laporkan berita yang mencurigakan (hoaks, misleading, atau tidak terverifikasi). '
                      'Tim admin akan meninjau dan memberikan verdict resmi. Laporan dengan voting terbanyak '
                      'akan mendapat prioritas peninjauan.',
                      style: TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 13,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Title
              _buildSectionTitle('Judul Berita'),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                style: const TextStyle(color: AppTheme.textPrimary),
                decoration: _inputDecoration(
                  hint: 'Masukkan judul berita yang dilaporkan',
                  prefixIcon: Icons.title_outlined,
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Judul wajib diisi';
                  if (v.trim().length < 10) return 'Judul minimal 10 karakter';
                  return null;
                },
                maxLength: 120,
              ),

              const SizedBox(height: 20),

              // Category
              _buildSectionTitle('Kategori'),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.border),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: DropdownButtonFormField<NewsCategory>(
                  value: _selectedCategory,
                  dropdownColor: AppTheme.surfaceElevated,
                  style: const TextStyle(color: AppTheme.textPrimary, fontSize: 15),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    prefixIcon: Icon(Icons.category_outlined, color: AppTheme.textMuted),
                  ),
                  items: NewsCategory.values.map((cat) {
                    return DropdownMenuItem(
                      value: cat,
                      child: Text(_categoryLabel(cat)),
                    );
                  }).toList(),
                  onChanged: (v) => setState(() => _selectedCategory = v!),
                ),
              ),

              const SizedBox(height: 20),

              // Source
              _buildSectionTitle('Sumber / Media'),
              const SizedBox(height: 8),
              TextFormField(
                controller: _sourceController,
                style: const TextStyle(color: AppTheme.textPrimary),
                decoration: _inputDecoration(
                  hint: 'Contoh: Kompas.com, Detik.com, Twitter, WhatsApp',
                  prefixIcon: Icons.source_outlined,
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Sumber wajib diisi';
                  return null;
                },
                maxLength: 60,
              ),

              const SizedBox(height: 20),

              // URL (optional)
              _buildSectionTitle('Link Sumber (Opsional)'),
              const SizedBox(height: 8),
              TextFormField(
                controller: _urlController,
                style: const TextStyle(color: AppTheme.textPrimary),
                decoration: _inputDecoration(
                  hint: 'https://...',
                  prefixIcon: Icons.link_outlined,
                ),
                keyboardType: TextInputType.url,
                validator: (v) {
                  if (v != null && v.trim().isNotEmpty) {
                    final uri = Uri.tryParse(v.trim());
                    if (uri == null || !uri.hasScheme) return 'Format URL tidak valid';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20),

              // Excerpt
              _buildSectionTitle('Ringkasan / Kutipan Isi Berita'),
              const SizedBox(height: 8),
              TextFormField(
                controller: _excerptController,
                style: const TextStyle(color: AppTheme.textPrimary),
                decoration: _inputDecoration(
                  hint: 'Tulis ringkasan atau kutipan bagian yang mencurigakan...',
                  prefixIcon: Icons.format_quote_outlined,
                ),
                maxLines: 4,
                maxLength: 500,
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Ringkasan wajib diisi';
                  if (v.trim().length < 20) return 'Ringkasan minimal 20 karakter';
                  return null;
                },
              ),

              const SizedBox(height: 32),

              // Submit button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: FilledButton.icon(
                  onPressed: _isSubmitting ? null : _submit,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  icon: _isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: Colors.black,
                            strokeWidth: 2,
                          ),
                        )
                      : const Icon(Icons.send_outlined),
                  label: Text(
                    _isSubmitting ? 'Mengirim...' : 'Kirim Laporan',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Disclaimer
              Text(
                'Dengan mengirim laporan, Anda menyetujui syarat & ketentuan PICKME GARUDA. '
                'Data laporan akan diproses oleh tim verifikasi.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: AppTheme.textMuted.withValues(alpha: 0.7),
                  fontSize: 11,
                  height: 1.4,
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        color: AppTheme.textPrimary,
        fontSize: 15,
        fontWeight: FontWeight.w700,
      ),
    );
  }

  InputDecoration _inputDecoration({
    required String hint,
    required IconData prefixIcon,
  }) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: AppTheme.textMuted.withValues(alpha: 0.5), fontSize: 14),
      prefixIcon: Icon(prefixIcon, color: AppTheme.textMuted, size: 20),
      filled: true,
      fillColor: AppTheme.surface,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppTheme.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppTheme.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppTheme.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppTheme.negative),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppTheme.negative, width: 2),
      ),
      counterStyle: TextStyle(color: AppTheme.textMuted.withValues(alpha: 0.5), fontSize: 11),
    );
  }

  String _categoryLabel(NewsCategory cat) {
    switch (cat) {
      case NewsCategory.politik: return '🏛️ Politik';
      case NewsCategory.ekonomi: return '💰 Ekonomi';
      case NewsCategory.sosial: return '👥 Sosial';
      case NewsCategory.teknologi: return '💻 Teknologi';
      case NewsCategory.kesehatan: return '🏥 Kesehatan';
      case NewsCategory.pendidikan: return '📚 Pendidikan';
      case NewsCategory.hukum: return '⚖️ Hukum';
      case NewsCategory.lainnya: return '📦 Lainnya';
    }
  }
}