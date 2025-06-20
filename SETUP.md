# GitHub Repository Setup Guide

## Prerequisites
- Git installed on your local machine
- GitHub account created
- Project files ready (which you already have)

## Step 1: Initialize Git Repository Locally

Open your terminal/command prompt in your project directory and run:

```bash
# Initialize a new Git repository
git init

# Add all files to staging area
git add .

# Create your first commit
git commit -m "Initial commit: Enhanced Hospital Management System MVP"
```

## Step 2: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `medicore-hms` (or your preferred name)
   - **Description**: `Enhanced Hospital Management System - AI-powered healthcare platform with role-based dashboards and intelligent medical assistant`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (since you already have files)
5. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/medicore-hms.git

# Rename the default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your project files uploaded
3. The README.md will display your project information

## Step 5: Set Up Branch Protection (Optional but Recommended)

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Branches" in the left sidebar
4. Click "Add rule" for branch protection
5. Set branch name pattern to `main`
6. Enable desired protections (e.g., "Require pull request reviews")

## Future Updates

To push future changes:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push origin main
```

## Troubleshooting

### If you get authentication errors:
1. Use GitHub CLI: `gh auth login`
2. Or set up SSH keys: [GitHub SSH Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
3. Or use Personal Access Token instead of password

### If you get "repository already exists" error:
- The repository name is taken, choose a different name
- Or you might be trying to create a repository that already exists

### If you get "permission denied" error:
- Check your GitHub username in the remote URL
- Verify you have write access to the repository
- Ensure you're authenticated properly