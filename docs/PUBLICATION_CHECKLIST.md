# Public publication checklist

Use this checklist before pushing a new version to a public repository.

- [ ] No passwords, tokens, cookies, SSH keys, `.env` files, or database URLs.
- [ ] No private IP addresses (`10/8`, `172.16/12`, or `192.168/16`).
- [ ] No customer names, CNPJs, telephone numbers, emails, or real circuit IDs.
- [ ] No screenshots or exports from the production dashboard.
- [ ] No company/client logos without written authorization.
- [ ] No production database dump, spreadsheet, CSV, ZIP, or server package.
- [ ] All demo records are marked as synthetic.
- [ ] Repository visibility and collaborators were reviewed.
- [ ] Employer/company publication authorization was confirmed when applicable.

## Suggested repository settings

1. Keep secret scanning and push protection enabled.
2. Protect the default branch after the first stable release.
3. Disable Discussions and Issues if you do not plan to maintain them.
4. Add a social-preview image generated from the synthetic demo only.
5. Do not add a permissive license until ownership and publication rights are clear.

