# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.158.0/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 14, 12, 10
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# ----------
# TODO: Docker compose is probably a better way to do this stuff.

# PWSH
COPY scripts/powershell-debian.sh /tmp/library-scripts/
RUN apt-get update && bash /tmp/library-scripts/powershell-debian.sh

# Starship
COPY scripts/starship.sh /tmp/library-scripts/
RUN apt-get update && bash /tmp/library-scripts/starship.sh

# TODO: Unhardcode the destination... use $HOME or something.
COPY scripts/home/.bashrc /home/node/.bashrc
COPY scripts/home/Microsoft.PowerShell_profile.ps1 /home/node/.config/powershell/Microsoft.PowerShell_profile.ps1
