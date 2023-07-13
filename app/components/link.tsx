import { type LinkProps, Link as RemixLink } from '@remix-run/react';
import { useRootLoaderData } from '~/utils/hooks';

// custom Link component that automatically reloads the document if the link is
// external to the app or base path
export function Link({ to, reloadDocument, ...props }: LinkProps) {
  const { basename } = useRootLoaderData();
  const path = String(to);
  const isExternal =
    path.startsWith('http') ||
    (path.startsWith('/') && !path.startsWith(basename));

  return (
    <RemixLink
      to={to}
      {...props}
      reloadDocument={reloadDocument || isExternal}
    />
  );
}
