from pathlib import Path
import shutil
import os
import subprocess
import requests

# TODO: use commit hash to determine whether rebuild needs to occur

PARENT = Path(__file__).parent.absolute()
DIST = PARENT / "live/www.mathgeniuszach.com"
LIVE = PARENT / "live"
URLS = PARENT / "urls.txt"
SCHEMAS = LIVE / "raw.githubusercontent.com/mathgeniuszach/origin-creator-schemas/main"
FLOW_HELP = LIVE / "raw.githubusercontent.com/mathgeniuszach/origins-flow-help/main"
DOCS = LIVE / "origins.readthedocs.io/en/"

with open(PARENT / "flyout.html") as file:
    FLYOUT = file.read()

os.chdir(PARENT)

# Clean and initialize folders
for path in (DIST, LIVE):
    if path.is_dir():
        shutil.rmtree(path)
    elif path.exists():
        path.unlink()

LIVE.mkdir(parents=True)
DIST.mkdir(parents=True, exist_ok=True)
SCHEMAS.mkdir(parents=True, exist_ok=True)
FLOW_HELP.mkdir(parents=True, exist_ok=True)

# Clone website files
if (PARENT.parent / "dist").is_dir():
    shutil.copytree(PARENT.parent / "dist", DIST, dirs_exist_ok=True)
else:
    subprocess.run(["git", "clone", "https://github.com/mathgeniuszach/mathgeniuszach.github.io.git", str(DIST)])

# Delete unnecessary files
for path in ("bin", "portfolio", "random", "apps/fpclib", ".git"):
    shutil.rmtree(DIST / path)
for path in (".gitattributes", ".gitignore", ".gitmodules", "CNAME", "portfolio.css", "README.md"):
    (DIST / path).unlink()
for path in DIST.glob("**/*.mp4"):
    path.unlink()

# Get raw github user content
subprocess.run(["git", "clone", "https://github.com/mathgeniuszach/origin-creator-schemas.git", str(SCHEMAS)])
subprocess.run(["git", "clone", "https://github.com/mathgeniuszach/origins-flow-help.git", str(FLOW_HELP)])

# Delete unnecessary files
for path in (SCHEMAS, FLOW_HELP):
    for file in (path / ".git",):
        shutil.rmtree(file)
    for file in (path / ".gitattributes", path / "README.md"):
        file.unlink()

(FLOW_HELP / ".gitignore").unlink()
shutil.rmtree(FLOW_HELP / "flow-bot")
shutil.rmtree(SCHEMAS / "scripts")

# Read and download basic urls
with open(URLS) as file:
    urls = file.read().strip().splitlines()

for url in urls:
    loc = Path("live/" + url[url.index(":")+3:])
    loc.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url) as resp:
        loc.write_bytes(resp.content)

# Build EVERY SINGLE WIKI
subprocess.run(["git", "clone", "https://github.com/apace100/origins-docs.git", "origins-docs"])
os.chdir("origins-docs")

# Get every branch
raw_branches = subprocess.run(["git", "branch", "-a"], capture_output=True).stdout.decode("utf-8").splitlines()
branches = [i.replace("remotes/origin/", "").strip("*/ ") for i in raw_branches if "latest" not in i]
branches.append("latest")

# Build readthedocs flyout versions
flyout_versions = "".join(f'<dd><a href="https://origins.readthedocs.io/en/{version}/">{version}</a></dd>' for version in branches)

# Build each docs
for version in branches:
    # Switch to branch
    subprocess.run(["git", "switch", version])
    # Build docs
    subprocess.run(["poetry", "run", "mkdocs", "build"])
    # Inject readthedocs flyout into all HTMLs
    flyout_html = FLYOUT.replace("{current}", version).replace("{versions}", flyout_versions.replace(version+"</a>", f"<strong>{version}</strong></a>"))
    for html in Path("site").glob("**/index.html"):
        with open(html) as file:
            html_data = file.read()
        with open(html, "w") as file:
            file.write(html_data.replace("</body>", flyout_html + "\n</body>"))
    # Move docs into place
    (DOCS / version).parent.mkdir(parents=True, exist_ok=True)
    shutil.move("site", DOCS / version)

# Copy over images
shutil.copy(DIST / "i/branch.svg", DOCS)
shutil.copy(DIST / "i/read-the-docs.svg", DOCS)

# Now delete docs
os.chdir("..")
shutil.rmtree("origins-docs")