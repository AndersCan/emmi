import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig( {
  site: "https://anderscan.github.io",
  base: "/emmi",
  integrations: [
    starlight( {
      title: "Emmi",
      social: {
        github: "https://anderscan.github.io/emmi",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "01 - Getting started",
              link: "/guides/getting-started/",
            },
            { label: "02 - Patterns ", link: "/guides/patterns/" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    } ),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
} );
