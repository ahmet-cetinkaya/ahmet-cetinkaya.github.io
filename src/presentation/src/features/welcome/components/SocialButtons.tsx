import { createSignal, Index, onMount } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import type { Link } from "~/domain/models/Link";
import { Container } from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";

type Props = {
  class?: string;
};

export default function SocialButtons(props: Props) {
  const linksService = Container.instance.linksService;
  const [socialLinks, setSocialLinks] = createSignal<Link[]>([]);

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
          <a href={socialLink().url} target="_blank" rel="noopener noreferrer">
            <Icon icon={socialLink().icon} class="size-6" fillColor="white" />
          </a>
        )}
      </Index>
    </div>
  );
}
