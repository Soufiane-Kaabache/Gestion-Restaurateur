#!/usr/bin/env bash
set -euo pipefail
# Simple TCP port forwarder to map a host port to a Docker container's IP:port using socat.
# Usage:
#   ./scripts/port_forward.sh <container-name> <container-port> <host-port>
# Example:
#   ./scripts/port_forward.sh gestionderestaurantcapverdienportugaisetbresilien-postgres-1 5432 55555

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <container-name> <container-port> <host-port>"
  exit 2
fi

CONTAINER="$1"
CONT_PORT="$2"
HOST_PORT="$3"

command -v docker >/dev/null 2>&1 || { echo "docker is required" >&2; exit 3; }
command -v socat >/dev/null 2>&1 || {
  echo "socat is required but not installed. On Debian/Ubuntu: sudo apt install socat" >&2
  exit 4
}

# Get container IP on bridge network (works for default bridge or docker compose networks)
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "${CONTAINER}" 2>/dev/null || true)

if [ -z "${CONTAINER_IP}" ]; then
  echo "Could not determine IP for container '${CONTAINER}'. Is it running?" >&2
  docker ps --filter "name=${CONTAINER}" --format 'table {{.Names}}	{{.Status}}	{{.Ports}}'
  exit 5
fi

LOGFILE="/tmp/port_forward_${CONTAINER}_${HOST_PORT}.log"

echo "Forwarding host: ${HOST_PORT} -> ${CONTAINER}:${CONT_PORT} (container IP ${CONTAINER_IP})"
echo "Logs: ${LOGFILE}"

# Start socat in background (reuseaddr, fork). Keep PID file.
nohup socat TCP-LISTEN:${HOST_PORT},reuseaddr,fork TCP:${CONTAINER_IP}:${CONT_PORT} >"${LOGFILE}" 2>&1 &
PF_PID=$!
echo "Started socat PID=${PF_PID}"
echo ${PF_PID} > "/tmp/port_forward_${CONTAINER}_${HOST_PORT}.pid"

cat <<EOF
To stop the forward:
  kill ${PF_PID} && rm -f /tmp/port_forward_${CONTAINER}_${HOST_PORT}.pid
EOF
