'use client';

import { DiscussionEmbed } from 'disqus-react';

interface DisqusCommentsProps {
  url: string;
  identifier: string;
  title: string;
}

export default function DisqusComments({ url, identifier, title }: DisqusCommentsProps) {
  return (
    <div className="bg-[#131b2f] rounded-2xl p-6 border border-white/5">
      <h3 className="text-xl font-bold text-white mb-6">Join the Discussion</h3>
      <DiscussionEmbed
        shortname="obd2hq"
        config={{
          url,
          identifier,
          title,
        }}
      />
    </div>
  );
}
