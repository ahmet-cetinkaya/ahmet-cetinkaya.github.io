import { createResource, Show } from "solid-js";
import type ICertificationsService from "~/application/features/certifications/services/abstraction/ICertificationsService";
import type ICurriculumVitaeService from "~/application/features/curriculumVitae/services/abstraction/ICurriculumVitaeService";
import type IEducationsService from "~/application/features/educations/services/abstraction/IEducationsService";
import type ILinksService from "~/application/features/links/abstraction/ILinksService";
import type IOrganizationsService from "~/application/features/organizations/services/abstraction/IOrganizationsService";
import Icons from "~/domain/data/Icons";
import { Links } from "~/domain/data/Links";
import { TranslationKeys } from "~/domain/data/Translations";
import Container from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import LoadingArea from "~/presentation/src/shared/components/LoadingArea";
import Timeline, { type Activity } from "~/presentation/src/shared/components/Timeline";
import Link from "~/presentation/src/shared/components/ui/Link";
import Title from "~/presentation/src/shared/components/ui/Title";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";

export default function Background() {
  const curriculumVitaeService: ICurriculumVitaeService = Container.instance.curriculumVitaeService;
  const certificationsService: ICertificationsService = Container.instance.certificationsService;
  const educationsService: IEducationsService = Container.instance.educationsService;
  const organizationsService: IOrganizationsService = Container.instance.organizationsService;
  const linksService: ILinksService = Container.instance.linksService;

  const translate = useI18n();

  const [linkedInLink] = createResource(getLinkedInLink);
  const [experienceActivities] = createResource(getCurriculumVitaeActivities);
  const [educationActivities] = createResource(getEducationActivities);
  const [certificationActivities] = createResource(getCertificationActivities);

  async function getLinkedInLink() {
    const linkedInLink = await linksService.get((x) => x.id === Links.linkedin);
    if (!linkedInLink) throw new Error("LinkedIn link not found");
    return linkedInLink;
  }

  async function getCurriculumVitaeActivities() {
    const curriculumVitae = await curriculumVitaeService.getAll();

    return await Promise.all(
      curriculumVitae.map(async (cv) => {
        const organization = await getOrganization(cv.organizationId);
        return {
          id: cv.id,
          title: cv.role,
          subtitle: organization.name,
          logo: organization.icon,
          descriptionMarkdown: cv.descriptionMarkdown,
          startDate: cv.startDate,
          endDate: cv.endDate,
        } as Activity;
      }),
    );
  }

  async function getCertificationActivities() {
    const certifications = await certificationsService.getAll();

    return await Promise.all(
      certifications.map(async (certification) => {
        const organization = await getOrganization(certification.organizationId);
        return {
          id: certification.id,
          title: certification.name,
          subtitle: organization.name,
          logo: organization.icon,
          descriptionMarkdown: certification.descriptionMarkdown,
          startDate: certification.date,
        } as Activity;
      }),
    );
  }

  async function getEducationActivities() {
    const educations = await educationsService.getAll();

    return await Promise.all(
      educations.map(async (education) => {
        const organization = await getOrganization(education.organizationId);
        return {
          id: education.id,
          title: organization.name,
          subtitle: education.department,
          logo: organization.icon,
          descriptionMarkdown: education.descriptionMarkdown,
          startDate: education.startDate,
          endDate: education.endDate,
        } as Activity;
      }),
    );
  }

  async function getOrganization(organizationId: number) {
    const organization = await organizationsService.get((x) => x.id === organizationId);
    if (!organization) throw new Error("Organization not found: " + organizationId);
    return organization;
  }

  return (
    <div class="px-8 py-4">
      <Title level={1}>{translate(TranslationKeys.apps_welcome_background)}</Title>

      <Show when={experienceActivities()} fallback={<Loading />}>
        <Title level={3}>{translate(TranslationKeys.apps_welcome_experiences)}</Title>
        <Timeline activities={experienceActivities()!} />
      </Show>

      <Show when={educationActivities()} fallback={<Loading />}>
        <Title level={3}>{translate(TranslationKeys.apps_welcome_educations)}</Title>
        <Timeline activities={educationActivities()!} />
      </Show>

      <Show when={certificationActivities()} fallback={<Loading />}>
        <Title level={3}>{translate(TranslationKeys.apps_welcome_certifications)}</Title>
        <Timeline activities={certificationActivities()!} />
      </Show>

      <Show when={linkedInLink()}>
        <Link
          class="fixed right-8 top-14 w-fit"
          href={linkedInLink()!.url}
          target="_blank"
          ariaLabel={translate(TranslationKeys.links_linkedin)}
        >
          <Icon icon={Icons.linkedin} class="size-4" />
          <span class="ms-2 hidden md:block">{translate(TranslationKeys.links_linkedin)}</span>
        </Link>
      </Show>
    </div>
  );

  function Loading() {
    return <LoadingArea class="h-12" />;
  }
}
