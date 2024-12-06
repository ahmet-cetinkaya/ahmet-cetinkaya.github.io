import { createSignal, onMount, Show } from "solid-js";
import type { ILinksService } from "~/application/features/links/abstraction/ILinksService";
import { Icons } from "~/domain/data/Icons";
import { Links } from "~/domain/data/Links";
import { TranslationKeys } from "~/domain/data/Translations";
import { Container } from "~/presentation/Container";
import HtmlEditor from "~/presentation/src/shared/components/HtmlEditor";
import Icon from "~/presentation/src/shared/components/Icon";
import Button from "~/presentation/src/shared/components/ui/Button";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";

export default function EmailApp() {
  const linksService: ILinksService = Container.instance.linksService;
  const translate = useI18n();

  const [emailLinkUrl, setEmail] = createSignal<string | undefined>();
  const [subject, setSubject] = createSignal("");
  const [body, setBody] = createSignal("");

  onMount(() => {
    getEmailLink();
  });

  async function getEmailLink() {
    const email = await linksService.get((link) => link.id === Links.email);
    if (!email) throw new Error("Email link not found");
    setEmail(email.url);
  }

  function onEmailSend() {
    const encodedEmailBody = encodeURIComponent(body());
    const encodedSubject = encodeURIComponent(subject());
    const mailto = `${emailLinkUrl()}?subject=${encodedSubject}&body=${encodedEmailBody}`;
    window.location.href = mailto;
  }

  return (
    <div class="flex size-full">
      <div class="w-1/5 border-r p-4">
        <h2 class="mb-4 text-xl font-bold">{translate(TranslationKeys.apps_email_folders)}</h2>
        <ul>
          <li class="mb-2">
            <a>{translate(TranslationKeys.apps_email_inbox)}</a>
          </li>
          <li class="mb-2">
            <a>{translate(TranslationKeys.apps_email_sent)}</a>
          </li>
          <li class="mb-2">
            <a>{translate(TranslationKeys.apps_email_drafts)}</a>
          </li>
          <li class="mb-2">
            <a>{translate(TranslationKeys.apps_email_trash)}</a>
          </li>
        </ul>
      </div>

      <div class="size-full">
        <h2 class="mb-4 flex items-center justify-between px-4 pt-4 text-2xl font-bold">
          {translate(TranslationKeys.apps_email_compose)}

          <Button type="button" onClick={onEmailSend} class="flex w-28 items-center justify-center gap-2">
            <Icon icon={Icons.send} class="size-4" />
            {translate(TranslationKeys.common_send)}
          </Button>
        </h2>

        <div class="size-full overflow-y-auto px-4 pb-16">
          <Show when={emailLinkUrl()}>
            <div class="mb-4 flex items-center gap-4">
              <label class="mb-2 w-20 text-sm font-bold text-gray-700" for="to">
                {translate(TranslationKeys.apps_email_to)}
              </label>
              <input
                id="to"
                type="email"
                class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                value={emailLinkUrl()!.replace("mailto:", "")}
                disabled={true}
              />
            </div>
          </Show>

          <div class="mb-4 flex items-center gap-4">
            <label class="mb-2 w-20 text-sm font-bold text-gray-700" for="subject">
              {translate(TranslationKeys.apps_email_subject)}
            </label>
            <input
              id="subject"
              type="text"
              class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              value={subject()}
              onInput={(e) => setSubject(e.currentTarget.value)}
            />
          </div>

          <HtmlEditor
            onInput={setBody}
            inputClass="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
