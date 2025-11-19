import { createResource, Index } from "solid-js";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import Container from "@presentation/Container";
import Icon from "@shared/components/Icon";
import Link from "@shared/components/ui/Link";

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
    <div class={mergeCls("flex w-full gap-4 overflow-x-auto overflow-y-hidden", props.class)}>
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
