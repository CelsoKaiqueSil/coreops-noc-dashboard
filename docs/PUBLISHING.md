# Publishing on GitHub and LinkedIn

The repository has been initialized locally, but the first commit and public push
should use the author's real Git identity.

## 1. Confirm publication rights

Before publishing, obtain written approval if the project was developed during
employment, with company infrastructure, or from internal requirements. The public
edition is neutral and synthetic, but the project description can still reveal
business context if it is too specific.

## 2. Configure the local Git identity

Run these commands inside this project, replacing the email with the address linked
to your GitHub account (or your GitHub `noreply` address):

```powershell
git config user.name "Celso Silveira"
git config user.email "SEU_EMAIL_DO_GITHUB"
git commit -m "feat: publish synthetic NOC operations demo"
```

## 3. Create the GitHub repository

Create an empty public repository named `coreops-noc-dashboard`. Do not add a
README, `.gitignore`, or license in the GitHub form because they already exist here.

Then connect and publish:

```powershell
git remote add origin https://github.com/CelsoKaiqueSil/coreops-noc-dashboard.git
git push -u origin main
```

If GitHub requests authentication, use the browser sign-in flow or a personal access
token. Never place the token inside a command saved in this repository.

## 4. Prepare the GitHub presentation

1. Add a synthetic dashboard screenshot to `docs/images/overview.png`.
2. Place that screenshot below the privacy notice in `README.md`.
3. Add repository topics such as `noc`, `telecom`, `dashboard`, `javascript`,
   `observability`, and `portfolio`.
4. Add the repository to the Featured section of your GitHub profile.

## 5. Publish on LinkedIn

1. Review [`linkedin-post.md`](../linkedin-post.md).
2. Add one overview image and one image of the incident treatment flow.
3. Link the public GitHub repository.
4. Describe your own contribution precisely: product discovery, business rules,
   frontend, backend, data quality, database, or deployment as applicable.
5. Add the repository to the Featured section of your LinkedIn profile.
