# Deploy to Production

Deploy the current worktree code to the Hostinger VPS and verify the deployment.

## Steps

1. Run `bash deploy.sh` from the worktree directory
2. Watch for build errors — if the build fails, identify the failing route and fix it before retrying
3. After deploy, verify the live site at https://tuitionsinindia.com responds correctly
4. Check Docker container is running: `ssh root@187.77.188.36 "docker ps"`
5. Tail logs for errors: `ssh root@187.77.188.36 "docker logs --tail 50 tuitionsinindia-web"`

## Common issues

- **Build fails with "Missing API key"** — a module is initialising an API client at module level without a fallback. Move the initialisation inside the request handler.
- **env file not found** — `.env.production` was deleted by rsync. Recover it from the running container: `docker inspect tuitionsinindia-web --format '{{range .Config.Env}}{{println .}}{{end}}' > /root/tuitionsinindia/.env.production`
- **Container not restarting** — if `docker compose up -d` silently keeps the old container, the env_file may be missing. Fix that first, then re-run.

## VPS details

- Host: `187.77.188.36`
- User: `root`
- App dir: `/root/tuitionsinindia`
- Container: `tuitionsinindia-web`
- Port: `3006` (mapped to internal 3000, proxied via Nginx)

$ARGUMENTS
