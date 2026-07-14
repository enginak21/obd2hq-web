'use client';

import { useState } from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { useTranslations } from 'next-intl';

interface DisqusCommentsProps {
  url: string;
  identifier: string;
  title: string;
}

export default function DisqusComments({ url, identifier, title }: DisqusCommentsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations('CommonUI');

  return (
    <div className="bg-[#131b2f] rounded-2xl p-6 border border-white/5">
      <h3 className="text-xl font-bold text-white mb-6">{t('joinDiscussion')}</h3>
      {isLoaded ? (
        <DiscussionEmbed
          shortname="obd2hq"
          config={{
            url,
            identifier,
            title,
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-300 transition-colors hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
        >
          {t('loadComments')}
        </button>
      )}
    </div>
  );
}
