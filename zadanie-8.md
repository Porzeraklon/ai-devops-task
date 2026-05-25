This is a classic Docker port conflict. The error specifically means that Docker is trying to expose port **3000** on your host machine, but another process or application is already actively using it.

Here are the most common ways to resolve this, depending on whether you want to free up port 3000 or just use a different one.

### 1. Find and Kill the Process Using Port 3000

If you want to clear the port so Docker can use it, you need to identify what process is currently hogging it. You can do this quickly using your terminal.

First, locate the Process ID (PID) using the port:

```bash
sudo ss -lptn 'sport = :3000'

```

*Alternatively, you can use `sudo lsof -i :3000`.*

Look for the `pid=` number in the output. Once you have the PID, terminate the process:

```bash
sudo kill -9 <PID>

```

After killing the process, try starting your Docker container again.

### 2. Check for "Zombie" Docker Containers

Sometimes, a previously run Docker container crashes or detaches but leaves the port bound in the background.

Check if any hidden or running containers are holding onto port 3000:

```bash
docker ps -a

```

If you spot an old container that shouldn't be running, stop and remove it:

```bash
docker stop <container_id>
docker rm <container_id>

```

### 3. Change the Host Port in Docker

If port 3000 is being used by something important on your machine and you don't want to kill it, you can simply tell Docker to use a different port on the host machine.

In Docker, port mappings are defined as `HOST:CONTAINER`. You only need to change the first number.

**If using `docker-compose.yml`:**
Change the mapping from `3000:3000` to something like `3001:3000`.

```yaml
services:
  app:
    # ...
    ports:
      - "3001:3000" # Maps host port 3001 to container port 3000

```

**If using the `docker run` command:**
Update the `-p` flag:

```bash
docker run -p 3001:3000 your_image_name

```

After making this change, you will access your app in the browser at `localhost:3001` instead of `3000`.

### 4. Restart the Docker Service (The "Turn It Off and On Again" Fix)

Occasionally, Docker's networking gets stuck and holds onto a port even when no containers are running. If `ss` or `lsof` don't show anything using port 3000, restarting the Docker daemon usually forces it to drop the ghost connection:

```bash
sudo systemctl restart docker

```
