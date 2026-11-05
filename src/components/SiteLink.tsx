import React from 'react';
import Link from '@docusaurus/Link';
import IconExternalLink from '@theme/Icon/ExternalLink';

/** Internal routes stay in-app; external destinations have a visible marker. */
export default function SiteLink({ children, ...props }: React.ComponentProps<typeof Link>) {
  const destination = props.to ?? props.href;
  const external = typeof destination === 'string' && /^https?:\/\//i.test(destination)
    && new URL(destination).hostname !== 'ysw.kr';
  return (
    <Link {...props}>
      {children}
      {external && <IconExternalLink />}
    </Link>
  );
}
