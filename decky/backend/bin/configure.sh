#!/bin/bash

# Verify root user.
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Set up the sudo permissions
echo "***POSSIBLE SECURITY RISK. UNDERSTAND THE FOLLOWING***"
echo "Adding password free sudo access to the following files for user ${SUDO_USER}:"
echo "/home/${SUDO_USER}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/ryzenadj"
echo "/home/${SUDO_USER}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/powertools.sh"
echo "/sys/class/drm/card0/device/pp_od_clk_voltage"
echo "/sys/class/drm/card0/device/power_dpm_force_performance_level"
cat <<-EOF > "/etc/sudoers.d/handypt_sudo"
${SUDO_USER} ALL=(ALL) NOPASSWD: /home/${SUDO_USER}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/ryzenadj*
${SUDO_USER} ALL=(ALL) NOPASSWD: /home/${SUDO_USER}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/powertools.sh*
${SUDO_USER} ALL=(ALL) NOPASSWD: /usr/bin/chmod a+w /sys/class/drm/card0/device/pp_od_clk_voltage
${SUDO_USER} ALL=(ALL) NOPASSWD: /usr/bin/chmod a+w /sys/class/drm/card0/device/power_dpm_force_performance_level
${SUDO_USER} ALL=(ALL) NOPASSWD: /usr/bin/tee /sys/class/drm/card0/device/pp_od_clk_voltage*
${SUDO_USER} ALL=(ALL) NOPASSWD: /usr/bin/tee /sys/class/drm/card0/device/power_dpm_force_performance_level*
EOF
