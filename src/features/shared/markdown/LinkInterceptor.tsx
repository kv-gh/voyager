import { styled } from "@linaria/react";
import React from "react";

import { buildBaseLemmyUrl } from "#/services/lemmy";
import { useAppSelector } from "#/store";

import InAppExternalLink, { AdditionalLinkProps } from "../InAppExternalLink";
import useLemmyUrlHandler from "../useLemmyUrlHandler";

const LinkInterceptor = styled(LinkInterceptorUnstyled)`
  -webkit-touch-callout: default;
`;

type LinkInterceptorUnstyledProps = React.JSX.IntrinsicElements["a"] & {
  el?: "div";

  /**
   * If we know the link is from Lemmy, force it to be resolved.
   * This helps on new instances that aren't fully federated.
   */
  forceResolveObject?: boolean;
} & AdditionalLinkProps;

function LinkInterceptorUnstyled({
  onClick: _onClick,
  onClickCompleted,
  forceResolveObject,
  ...props
}: LinkInterceptorUnstyledProps) {
  const connectedInstanceUrl = useAppSelector((state) =>
    buildBaseLemmyUrl(state.auth.connectedInstance),
  );
  const { redirectToLemmyObjectIfNeeded } = useLemmyUrlHandler();

  const absoluteHref = (() => {
    if (!props.href) return;

    try {
      return new URL(props.href, connectedInstanceUrl).href;
    } catch (_) {
      return;
    }
  })();

  async function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    _onClick?.(e);

    if (!props.href) return;
    if (e.metaKey || e.ctrlKey) return;
    if (e.defaultPrevented) return;

    redirectToLemmyObjectIfNeeded(props.href, e, forceResolveObject);
  }

  // Sometimes markdown thinks things are URLs that aren't URLs
  if (!absoluteHref) return props.children;

  return (
    <InAppExternalLink
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      onClickCompleted={onClickCompleted}
      href={absoluteHref}
    />
  );
}

export default LinkInterceptor;
