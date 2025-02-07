import I18nNavigationLink from "@/components/I18nNavigationLink";
import type { AppSettings } from "@/graphql/__generated__/sdk";
import { getContentful } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

/**
 * Fetches application settings from Contentful.
 *
 * @returns {Promise<AppSettings>} The application settings.
 * @throws Will throw an error if fetching settings fails.
 */
async function getData() {
  const { isEnabled: preview } = await draftMode();
  const client = getContentful(preview);
  const result = await client.getAppSettings();
  const settings = result?.data?.appSettingsCollection?.items[0];
  if (result.errors || !settings) {
    console.error(result.errors, "Error fetching settings");
    return notFound();
  }
  return settings as AppSettings;
}

async function Footer() {
  const settings = await getData();
  if (!settings) return notFound();
  return (
    <footer className="bg-primary border-t-accent-foreground text-accent-foreground dark:bg-accent dark:text-accent-background mt-auto w-full border-t py-8">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Branding  */}
          <div className="space-y-4">
            <I18nNavigationLink href="/" className="text-lg font-bold">
              {settings.appTitle}
            </I18nNavigationLink>
          </div>

          {/* Site Navigation Links */}
          <div className="grid grid-cols-2 gap-4 md:col-span-3 md:grid-cols-3">
            {/* Site Navigation */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">
                {settings.siteNavigationTitle}
              </h3>
              <ul className="space-y-2">
                {settings.siteNavigation?.itemsCollection?.items.map((item) => (
                  <li key={item?.sys?.id}>
                    <I18nNavigationLink
                      href={item?.slug!}
                      className="hover:text-accent-foreground/80 text-sm"
                    >
                      {item?.name}
                    </I18nNavigationLink>
                  </li>
                ))}
              </ul>
            </div>
            {/* Services Navigation */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">
                {settings.servicesNavigationTitle}
              </h3>
              <ul className="space-y-2">
                {settings.servicesNavigation?.itemsCollection?.items.map(
                  (item) => (
                    <li key={item?.sys?.id}>
                      <I18nNavigationLink
                        href={item?.slug!}
                        className="hover:text-accent-foreground/80 text-sm"
                      >
                        {item?.name}
                      </I18nNavigationLink>
                    </li>
                  ),
                )}
              </ul>
            </div>
            {/* Legal Navigation */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase">
                {settings.legalNavigationTitle}
              </h3>
              <ul className="space-y-2">
                {settings.legalNavigation?.itemsCollection?.items.map(
                  (item) => (
                    <li key={item?.sys?.id}>
                      <I18nNavigationLink
                        href={item?.slug!}
                        className="hover:text-accent-foreground/80 text-sm"
                      >
                        {item?.name}
                      </I18nNavigationLink>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Footer copyright Text */}
      <p className="container mx-auto mt-8 px-4 text-center text-sm">
        {settings.copyrightText}
      </p>
    </footer>
  );
}

export default Footer;
