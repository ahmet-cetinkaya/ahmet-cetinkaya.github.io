import { createSignal, Index, Show, createMemo, createResource } from "solid-js";
import type ILinksService from "~/application/features/links/abstraction/ILinksService";
import Icons from "~/domain/data/Icons";
import { Links } from "~/domain/data/Links";
import { TranslationKeys } from "~/domain/data/Translations";
import Container from "~/presentation/Container";
import HtmlEditor from "~/presentation/src/shared/components/HtmlEditor";
import Icon from "~/presentation/src/shared/components/Icon";
import Button from "~/presentation/src/shared/components/ui/Button";
import Input from "~/presentation/src/shared/components/ui/Input";
import Title from "~/presentation/src/shared/components/ui/Title";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";

export default function EmailApp() {
  const linksService: ILinksService = Container.instance.linksService;
  const translate = useI18n();

  const [emailLinkUrl] = createResource(getEmailLink);
  const [subject, setSubject] = createSignal("");
  const [body, setBody] = createSignal("");

  async function getEmailLink() {
    const email = await linksService.get((link) => link.id === Links.email);
    if (!email) throw new Error("Email link not found");
    return email.url;
  }

  function redirectToMailClient() {
    const encodedEmailBody = encodeURIComponent(body());
    const encodedSubject = encodeURIComponent(subject());
    const mailto = `${emailLinkUrl()}?subject=${encodedSubject}&body=${encodedEmailBody}`;

    window.location.href = mailto;
  }

  function onEmailSend() {
    redirectToMailClient();
  }

  return (
    <div class="flex size-full">
      <div class="hidden basis-48 border-r border-surface-300 p-4 md:block">
        <Title level={2} class="mb-2 text-xl">
          {translate(TranslationKeys.apps_email_folders)}
        </Title>
        <EmailFolders />
      </div>

      <div class="size-full px-10">
        <Title level={2} class="mb-4 flex items-center justify-between px-4 pt-4 text-2xl font-bold">
          {translate(TranslationKeys.apps_email_compose)}
        </Title>

        <EmailForm />

        <div class="flex justify-end pe-4">
          <Button
            type="button"
            variant="primary"
            onClick={onEmailSend}
            class="w-28"
            ariaLabel={translate(TranslationKeys.common_send)}
          >
            <div class="flex items-center justify-center gap-2">
              <Icon icon={Icons.send} class="size-4" />
              {translate(TranslationKeys.common_send)}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  function EmailFolders() {
    const folders = createMemo(() => [
      {
        label: TranslationKeys.apps_email_inbox,
        icon: Icons.inbox,
      },
      {
        label: TranslationKeys.apps_email_sent,
        icon: Icons.send,
      },
      {
        label: TranslationKeys.apps_email_drafts,
        icon: Icons.drafts,
      },
      {
        label: TranslationKeys.apps_email_trash,
        icon: Icons.trash,
      },
    ]);

    return (
      <Index each={folders()}>
        {(folder) => (
          <ul>
            <li>
              <Button
                variant="text"
                class="duration-3000 w-full rounded text-left transition-all ease-linear hover:bg-white hover:text-surface-500"
                ariaLabel={translate(folder().label)}
              >
                <span class="flex items-center gap-2">
                  <Icon icon={folder().icon} class="size-3" />
                  {translate(folder().label)}
                </span>
              </Button>
            </li>
          </ul>
        )}
      </Index>
    );
  }

  function EmailForm() {
    return (
      <div class="w-full overflow-y-auto p-4">
        <Show when={emailLinkUrl()}>
          <div class="mb-4 flex items-center gap-4">
            <label class="mb-2 w-20 text-sm font-bold text-gray-200" for="to">
              {translate(TranslationKeys.apps_email_to)}
            </label>
            <Input id="to" type="email" value={emailLinkUrl()!.replace("mailto:", "")} disabled={true} />
          </div>
        </Show>

        <div class="mb-4 flex items-center gap-4">
          <label class="mb-2 w-20 text-sm font-bold text-gray-200" for="subject">
            {translate(TranslationKeys.apps_email_subject)}
          </label>
          <Input id="subject" value={subject()} onInputChange={setSubject} />
        </div>

        <HtmlEditor
          onInput={setBody}
          inputClass="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-200 shadow focus:outline-none"
        />
      </div>
    );
  }
}
