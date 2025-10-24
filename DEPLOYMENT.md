# 🚀 Deploying Singapore Drinks App to GitHub Pages

## Prerequisites
- GitHub account
- Git installed on your computer
- Node.js and npm installed

## Step-by-Step Deployment Instructions

### 1. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it: `singapore-drinks-app` (or any name you prefer)
5. Make it **Public** (required for free GitHub Pages)
6. Click "Create repository"

### 2. Update the Homepage URL
1. Open `package.json`
2. Replace `yourusername` with your actual GitHub username in the homepage field:
   ```json
   "homepage": "https://yourusername.github.io/singapore-drinks-app"
   ```

### 3. Initialize Git and Connect to GitHub
Open terminal/command prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Singapore Drinks App"

# Add your GitHub repository as origin (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/singapore-drinks-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Install Dependencies and Deploy
```bash
# Install the gh-pages package
npm install

# Build and deploy to GitHub Pages
npm run deploy
```

### 5. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select branch: `gh-pages`
6. Click "Save"

### 6. Access Your Live App
Your app will be available at:
`https://yourusername.github.io/singapore-drinks-app`

## 🔄 Updating Your App

Whenever you make changes to your app:

```bash
# Add your changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to main branch
git push origin main

# Deploy updated version
npm run deploy
```

## 🎯 What Happens During Deployment

1. `npm run predeploy` builds your React app for production
2. `npm run deploy` pushes the built files to the `gh-pages` branch
3. GitHub Pages serves your app from the `gh-pages` branch

## 📝 Notes

- **First deployment** may take a few minutes to appear
- **Updates** typically appear within 1-2 minutes
- The app will work fully offline after first visit
- All your drink data and functionality will work perfectly

## 🐛 Troubleshooting

- **404 Error**: Check that repository is public and GitHub Pages is enabled
- **Blank Page**: Verify the homepage URL in package.json matches your repository
- **Build Errors**: Run `npm run build` locally first to check for errors

## 🌟 Features That Will Work Online

✅ Browse all 47 Singapore drinks
✅ Customize drinks with local options
✅ Find drink shops with filters
✅ View opening hours and contact info
✅ Responsive design for mobile
✅ Offline functionality after first load

Your Singapore Drinks App will be live and accessible to anyone worldwide! 🇸🇬🥤