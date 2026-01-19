import React from 'react';
export default function ImagePreview({ url }: { url: string }) {
  return <img src={url} className="rounded-xl max-w-full" />;
}
