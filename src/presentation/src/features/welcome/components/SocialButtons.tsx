import { createResource, Index } from "solid-js";
import { mergeCls } from "~/presentation/src/core/acore-ts/ui/ClassHelpers";
import Container from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import Link from "~/presentation/src/shared/components/ui/Link";

type Props = {
  class?: string;
};

export default function SocialButtons(props: Props) {
  const linksService = Container.instance.linksService;

  const [socialLinks] = createResource(getSocialLinks);

  async function getSocialLinks() {
    const links = await linksService.getAll();
    return links;
  }

  return (
    <div class={mergeCls("flex w-full gap-4 overflow-scroll", props.class)}>
      <Index each={socialLinks()}>
        {(socialLink) => (
          <Link
            href={socialLink().url}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel={socialLink().name}
            variant="text"
          >
            <Icon icon={socialLink().icon} class="size-6" fillColor="white" />
          </Link>
        )}
      </Index>
    </div>
  );
}
