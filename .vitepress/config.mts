import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Modern React Guide",
  description: "Complete Step-by-Step Guide: From Zero to Production. Build modern React applications using industry standards and best practices.",
  base: '/Build-Deploy-The-React-App/',
  ignoreDeadLinks: true, // Temporarily ignore dead links during initial setup
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/01-project-setup' },
      { text: 'GitHub', link: 'https://github.com/CodeTreatise/Build-Deploy-The-React-App' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: '1. Project Setup', link: '/01-project-setup' },
          { text: '2. Material-UI Setup', link: '/02-material-ui-setup' }
        ]
      },
      {
        text: 'Core Features',
        items: [
          { text: '3. Routing & Navigation', link: '/03-routing-navigation' },
          { text: '4. State Management', link: '/04-state-management' },
          { text: '5. Forms & Validation', link: '/05-forms-validation' },
          { text: '6. API Integration', link: '/06-api-integration' }
        ]
      },
      {
        text: 'Testing & Deployment',
        items: [
          { text: '7. Testing Strategy', link: '/07-testing-strategy' },
          { text: '8. Build & Deployment', link: '/08-build-deployment' }
        ]
      },
      {
        text: 'Advanced Topics',
        items: [
          { text: '9. Performance & Security', link: '/09-performance-security' },
          { text: '10. Complete Application', link: '/10-complete-application' },
          { text: '11. Debugging & Troubleshooting', link: '/11-debugging-troubleshooting' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CodeTreatise/Build-Deploy-The-React-App' }
    ],

    editLink: {
      pattern: 'https://github.com/CodeTreatise/Build-Deploy-The-React-App/edit/main/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License. | ⭐ <a href="https://github.com/CodeTreatise/Build-Deploy-The-React-App">Star on GitHub</a> | 🍴 <a href="https://github.com/CodeTreatise/Build-Deploy-The-React-App/fork">Fork this project</a>',
      copyright: 'Copyright © 2025 CodeTreatise - Modern React Guide'
    }
  }
})
