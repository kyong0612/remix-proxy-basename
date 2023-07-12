import { type LinkProps, Link as RemixLink } from '@remix-run/react';
import { useRootLoaderData } from '~/utils/hooks';

// custom Link component that automatically reloads the document if the link is
// external to the app or base path
export function Link({ to, ...props }: LinkProps) {
  const { basename } = useRootLoaderData();
  return (
    <RemixLink
      to={to}
      {...props}
      reloadDocument={props.reloadDocument || !String(to).startsWith(basename)}
    />
  );
}
