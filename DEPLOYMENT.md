# Deployment Instructions

This Modern React Guide is set up to automatically deploy to GitHub Pages using VitePress and GitHub Actions.

## 🚀 How to Deploy

### Prerequisites
1. Create a GitHub repository for this project
2. Enable GitHub Pages in your repository settings

### Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: Modern React Guide with VitePress"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/modern-react-guide.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Source: Deploy from a branch → GitHub Actions
   - Save

3. **Update Configuration:**
   - Edit `.vitepress/config.mts`
   - Update the `base` field to match your repository name: `base: '/your-repo-name/'`
   - Update GitHub links to point to your repository

### Automatic Deployment

The site will automatically rebuild and deploy when you push changes to the `main` branch, thanks to the GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## 📁 Project Structure

```
modern-react-guide/
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── .vitepress/
│   ├── config.mts                  # VitePress configuration
│   ├── cache/                      # Build cache
│   └── dist/                       # Build output
├── *.md                            # Guide chapters
├── index.md                        # Homepage
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🔧 Configuration

The site configuration is in `.vitepress/config.mts`. Key settings:

- **title**: Site title
- **description**: Site description
- **base**: GitHub Pages base path (must match repository name)
- **themeConfig**: Navigation, sidebar, and theme settings

## 📚 Adding Content

1. Create new `.md` files in the root directory
2. Update the sidebar configuration in `.vitepress/config.mts`
3. Push changes to trigger automatic deployment

Your site will be available at: `https://YOUR-USERNAME.github.io/modern-react-guide/`