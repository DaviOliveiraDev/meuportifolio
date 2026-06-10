'use client';

import { useState } from 'react';
import { Share2, Code, Check } from 'lucide-react';
import { getRarityTier } from '@/features/gamification/lib/calculate-tier';
import { toast } from 'sonner';

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

interface ShareCardPanelProps {
  profile?: {
    username: string;
    name: string;
    ovr?: number;
  } | null;
  className?: string;
}

export function ShareCardPanel({ profile, className }: ShareCardPanelProps) {
  const [copiedType, setCopiedType] = useState<'markdown' | 'link' | null>(null);

  if (!profile) return null;

  const username = profile.username;
  const ovr = profile.ovr || 1;
  const tier = getRarityTier(ovr);

  // Determina os links e textos de compartilhamento
  const host = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://devfolio.com';
  const portfolioUrl = `${host}/${username}`;
  const compareUrl = `${host}/compare?users=${username}`;
  const cardImageUrl = `${host}/card/${username}`;

  const shareText = `Acabo de atingir o Tier ${tier.name} no DevFolio com OVR ${ovr}! 🚀 Duvido o seu OVR de desenvolvimento ser maior que o meu. Compare o seu card de atributos com o meu aqui:`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopiedType('link');
    toast.success('Link do portfólio copiado!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyMarkdown = () => {
    // Markdown syntax to embed the dynamic card image linking to the portfolio
    const markdownCode = `[![DevFolio Card](${cardImageUrl})](${portfolioUrl})`;
    navigator.clipboard.writeText(markdownCode);
    setCopiedType('markdown');
    toast.success('Código Markdown copiado! Cole no seu README.md do GitHub.');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(compareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedin = () => {
    // Para LinkedIn, abrimos a tela de compartilhamento de link direcionando para a comparação ou portfólio
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-sm ${className}`}>
      <h3 className="font-extrabold text-neutral-850 dark:text-neutral-200 text-xs flex items-center gap-1.5 mb-4 uppercase tracking-wider">
        <Share2 className="w-4.5 h-4.5 text-violet-500" />
        Viralizar Reputação
      </h3>

      <div className="space-y-3">
        {/* Redes Sociais */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareOnLinkedin}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0a66c2]/10 hover:bg-[#0a66c2]/15 border border-[#0a66c2]/20 text-[#0a66c2] dark:text-[#378fe9] text-xs font-bold transition-all cursor-pointer"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </button>
          <button
            onClick={shareOnTwitter}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-950 dark:hover:bg-neutral-950/70 border border-neutral-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Twitter className="w-4 h-4 text-sky-400" />
            Twitter / X
          </button>
        </div>

        <div className="h-[1px] bg-neutral-100 dark:bg-neutral-850 my-2" />

        {/* Links Rápidos */}
        <div className="space-y-2.5">
          {/* GitHub README embed */}
          <button
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/70 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/50 border border-neutral-200/50 dark:border-neutral-850/60 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-7 h-7 rounded-lg bg-neutral-200/50 dark:bg-neutral-850 flex items-center justify-center text-neutral-600 dark:text-neutral-450">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200 leading-none">Card no GitHub</p>
                <p className="text-[10px] text-neutral-450 mt-1 font-light leading-none">Copiar código Markdown para o README</p>
              </div>
            </div>
            <div className="text-neutral-400 dark:text-neutral-500">
              {copiedType === 'markdown' ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <ChevronRightIcon className="w-4.5 h-4.5" />}
            </div>
          </button>

          {/* Copy Portfolio URL */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/70 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/50 border border-neutral-200/50 dark:border-neutral-850/60 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-7 h-7 rounded-lg bg-neutral-200/50 dark:bg-neutral-850 flex items-center justify-center text-neutral-600 dark:text-neutral-450">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200 leading-none">Copiar Link do Portfólio</p>
                <p className="text-[10px] text-neutral-450 mt-1 font-light leading-none">URL exclusiva do seu portfólio</p>
              </div>
            </div>
            <div className="text-neutral-400 dark:text-neutral-500">
              {copiedType === 'link' ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <ChevronRightIcon className="w-4.5 h-4.5" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
