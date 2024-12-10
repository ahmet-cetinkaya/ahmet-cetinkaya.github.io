import { createSignal, Index, onMount } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import type { Link as LinkModel } from "~/domain/models/Link";
import { Container } from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import Link from "~/presentation/src/shared/components/ui/Link";

type Props = {
  class?: string;
};

export default function SocialButtons(props: Props) {
  const linksService = Container.instance.linksService;
  const [socialLinks, setSocialLinks] = createSignal<LinkModel[]>([]);

  onMount(() => {
    getSocialLinks();
  });

  async function getSocialLinks() {
    const data = await linksService.getAll();
    setSocialLinks(data);
  }

  return (
    <div class={mergeCls("flex gap-4", props.class)}>
      <Index each={socialLinks()}>
        {(socialLink) => (
          <Link href={socialLink().url} target="_blank" rel="noopener noreferrer" ariaLabel={socialLink().name} variant="text">
            <Icon icon={socialLink().icon} class="size-6" fillColor="white" />
          </Link>
        )}
      </Index>
    </div>
  );
}
