import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Clock, Eye, ExternalLink, Activity, Flag, ThumbsUp, Brain, AlertCircle } from 'lucide-react';
import { Report, getStatusColor, getSentimentColor, getSentimentBg, getPriorityColor, getPriorityLabel, getVerdictColor, getVerdictLabel } from '@/lib/data/reports';

const THUMBNAILS = [
  '/images/login.png',
  '/images/login-portrait.png',
  '/images/login-landscape.png',
  '/images/login-left.png',
  '/images/layer.png',
];

function thumbnailFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return THUMBNAILS[Math.abs(hash) % THUMBNAILS.length];
}

const statusIcon = {
  approved: CheckCircle,
  rejected: XCircle,
  pending: Clock,
  reviewing: Eye,
};

const statusLabel = {
  approved: 'Valid',
  rejected: 'Hoaks',
  pending: 'Pending',
  reviewing: 'Review',
};

export function ReportCard({ report }: { report: Report }) {
  const StatusIcon = statusIcon[report.status];

  return (
    <Link
      href={`/admin/reports/${report.id}`}
      className="group block rounded-xl border border-slate-800 bg-slate-800/30 overflow-hidden hover:border-slate-700 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50"
    >
      <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
        <Image
          src={thumbnailFor(report.id)}
          alt={report.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-slate-900/80 border border-slate-700 px-2.5 py-0.5 text-xs text-slate-200">
            {report.category}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${getPriorityColor(report.priority)}`}>
            <Flag className="h-2.5 w-2.5" />
            {getPriorityLabel(report.priority)}
          </span>
        </div>
        
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center space-x-1 rounded-full border px-2 py-0.5 text-xs ${getStatusColor(report.status)}`}>
            <StatusIcon className="h-3 w-3" />
            <span>{statusLabel[report.status]}</span>
          </span>
        </div>

        {report.llmAnalysis && (
          <div className="absolute bottom-3 left-3 right-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getVerdictColor(report.llmAnalysis.suggestedVerdict)} bg-slate-900/80 backdrop-blur-sm`}>
              <Brain className="h-3 w-3" />
              <span className="text-xs font-medium capitalize">{getVerdictLabel(report.llmAnalysis.suggestedVerdict)}</span>
              <span className="text-xs font-mono text-slate-400">{(report.llmAnalysis.overallFactCheckScore * 100).toFixed(0)}%</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 line-clamp-2 group-hover:text-slate-50 transition-colors">
          {report.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2">
          {report.excerpt}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="inline-flex items-center space-x-1">
              <ExternalLink className="h-3 w-3" />
              <span className="truncate max-w-[8rem]">{report.source}</span>
            </span>
            <span>•</span>
            <span>{new Date(report.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className={`inline-flex items-center space-x-1 rounded-full border px-2 py-0.5 text-xs ${getSentimentBg(report.sentiment.label)}`}>
            <Activity className="h-3 w-3" />
            <span className={`capitalize ${getSentimentColor(report.sentiment.label)}`}>
              {report.sentiment.label}
            </span>
            <span className="text-slate-400">
              ({(report.sentiment.score * 100).toFixed(0)}%)
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center space-x-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{report.votes}</span>
            </span>
            {report.spamScore > 0.5 && (
              <span className="inline-flex items-center space-x-1 text-red-400">
                <AlertCircle className="h-3 w-3" />
                <span>Spam</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}