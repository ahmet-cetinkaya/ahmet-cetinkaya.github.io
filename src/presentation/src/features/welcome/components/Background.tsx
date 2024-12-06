import { createSignal, onMount, Show } from "solid-js";
import type { ICertificationsService } from "~/application/features/certifications/services/abstraction/ICertificationsService";
import type { ICurriculumVitaeService } from "~/application/features/curriculumVitae/services/abstraction/ICurriculumVitaeService";
import type { IEducationsService } from "~/application/features/educations/services/abstraction/IEducationsService";
import type { ILinksService } from "~/application/features/links/abstraction/ILinksService";
import type { IOrganizationsService } from "~/application/features/organizations/services/abstraction/IOrganizationsService";
import { Icons } from "~/domain/data/Icons";
import { Links } from "~/domain/data/Links";
import { TranslationKeys } from "~/domain/data/Translations";
import type { Link as LinkModel } from "~/domain/models/Link";
import { Container } from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import LoadingArea from "~/presentation/src/shared/components/LoadingArea";
import Timeline, { type Activity } from "~/presentation/src/shared/components/Timeline";
import Link from "~/presentation/src/shared/components/ui/Link";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";

export default function Background() {
  const curriculumVitaeService: ICurriculumVitaeService = Container.instance.curriculumVitaeService;
  const certificationsService: ICertificationsService = Container.instance.certificationsService;
  const educationsService: IEducationsService = Container.instance.educationsService;
  const organizationsService: IOrganizationsService = Container.instance.organizationsService;
  const linksService: ILinksService = Container.instance.linksService;

  const translate = useI18n();

  const [experienceActivities, setExperienceActivities] = createSignal<Activity[] | undefined>(undefined);
  const [educationActivities, setEducationActivities] = createSignal<Activity[] | undefined>(undefined);
  const [certificationActivities, setCertificationActivities] = createSignal<Activity[] | undefined>(undefined);
  const [linkedInLink, setLinkedInLink] = createSignal<LinkModel | undefined>(undefined);

  onMount(() => {
    getLinkedInLink();
    getCurriculumVitaeActivities();
    getEducationActivities();
    getCertificationActivities();
  });

  async function getLinkedInLink() {
    const linkedInLink = await linksService.get((x) => x.id === Links.linkedin);
    if (!linkedInLink) throw new Error("LinkedIn link not found");
    setLinkedInLink(linkedInLink);
  }

  async function getCurriculumVitaeActivities() {
    const curriculumVitae = await curriculumVitaeService.getAll();

    const experienceActivities = await Promise.all(
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
    setExperienceActivities(experienceActivities);
  }

  async function getCertificationActivities() {
    const certifications = await certificationsService.getAll();

    const certificationActivities = await Promise.all(
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
    setCertificationActivities(certificationActivities);
  }

  async function getEducationActivities() {
    const educations = await educationsService.getAll();

    const educationActivities = await Promise.all(
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
    setEducationActivities(educationActivities);
  }

  async function getOrganization(organizationId: number) {
    const organization = await organizationsService.get((x) => x.id === organizationId);
    if (!organization) throw new Error("Organization not found: " + organizationId);
    return organization;
  }

  return (
    <>
      <Show when={experienceActivities()} fallback={<_LoadingArea />}>
        <Title label={translate(TranslationKeys.apps_welcome_experiences)} />
        <Timeline activities={experienceActivities()!} />
      </Show>

      <Show when={educationActivities()} fallback={<_LoadingArea />}>
        <Title label={translate(TranslationKeys.apps_welcome_educations)} />
        <Timeline activities={educationActivities()!} />
      </Show>

      <Show when={certificationActivities()} fallback={<_LoadingArea />}>
        <Title label={translate(TranslationKeys.apps_welcome_certifications)} />
        <Timeline activities={certificationActivities()!} />
      </Show>

      <Show when={linkedInLink()}>
        <Link class="fixed right-14 top-14 w-28 rounded-3xl" href={linkedInLink()!.url} target="_blank">
          <Icon icon={Icons.linkedin} class="size-4" />
          <span class="ms-2">{translate(TranslationKeys.links_linkedin)}</span>
        </Link>
      </Show>
    </>
  );

  function Title(props: { label: string }) {
    return <h2 class="mb-3 text-2xl font-bold">{props.label}</h2>;
  }

  function _LoadingArea() {
    return <LoadingArea class="h-12" />;
  }
}
