#!/bin/bash

# Exit on error
set -e

# Configuration
APP_NAME="Music"
APP_DIR="/opt/music-pi"
DESKTOP_DIR="/home/jaguar/Desktop"
SERVICE_NAME="music-pi"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display usage
show_usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -h, --host HOST       Raspberry Pi hostname or IP address (required)"
    echo "  -u, --user USER       SSH username (default: jaguar)"
    echo "  -k, --key KEY         Path to SSH private key (optional)"
    echo "  -p, --port PORT       SSH port (default: 22)"
    echo "  --help                Show this help message"
    exit 1
}

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local input=""
    
    # Print the prompt and default value
    printf "${YELLOW}%s${NC} [${GREEN}%s${NC}]: " "$prompt" "$default"
    read -r input
    
    # If input is empty, use default
    if [ -z "$input" ]; then
        input="$default"
    fi
    
    # Return just the input value
    printf "%s" "$input"
}

# Default values
SSH_USER="jaguar"
SSH_PORT="22"
SSH_KEY=""
SSH_HOST=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            SSH_HOST="$2"
            shift 2
            ;;
        -u|--user)
            SSH_USER="$2"
            shift 2
            ;;
        -k|--key)
            SSH_KEY="$2"
            shift 2
            ;;
        -p|--port)
            SSH_PORT="$2"
            shift 2
            ;;
        --help)
            show_usage
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            ;;
    esac
done

echo "Debug: Starting interactive mode..."

# If host is not provided via command line, prompt for it
if [ -z "$SSH_HOST" ]; then
    echo -e "${YELLOW}Enter Raspberry Pi hostname or IP address${NC} [${GREEN}music${NC}]: "
    read -r input
    SSH_HOST="${input:-music}"
fi

# If username is not provided via command line, prompt for it
if [ -z "$SSH_USER" ]; then
    echo -e "${YELLOW}Enter SSH username${NC} [${GREEN}jaguar${NC}]: "
    read -r input
    SSH_USER="${input:-jaguar}"
fi

# Build SSH command with connection multiplexing
SSH_CMD="ssh -o ControlMaster=auto -o ControlPath=/tmp/ssh-%r@%h:%p -o ControlPersist=5m"
if [ ! -z "$SSH_KEY" ]; then
    SSH_CMD="$SSH_CMD -i $SSH_KEY"
fi
SSH_CMD="$SSH_CMD -p $SSH_PORT $SSH_USER@$SSH_HOST"

# Build rsync command with the same SSH options
RSYNC_SSH="ssh -o ControlMaster=auto -o ControlPath=/tmp/ssh-%r@%h:%p -o ControlPersist=5m -p $SSH_PORT"
if [ ! -z "$SSH_KEY" ]; then
    RSYNC_SSH="$RSYNC_SSH -i $SSH_KEY"
fi

echo -e "${GREEN}Starting Music Pi deployment to $SSH_HOST...${NC}"

# Test SSH connection
echo "Testing SSH connection..."
if ! $SSH_CMD "echo 'Connection successful'" > /dev/null 2>&1; then
    echo -e "${RED}Failed to connect to $SSH_HOST${NC}"
    echo -e "${YELLOW}Please check:${NC}"
    echo "1. The Raspberry Pi is powered on and connected to the network"
    echo "2. SSH is enabled on the Raspberry Pi"
    echo "3. The hostname/IP address is correct"
    echo "4. The username is correct"
    echo "5. You have the correct SSH key (if using one)"
    exit 1
fi

# Create application directory first
echo "Creating application directory..."
$SSH_CMD "sudo mkdir -p $APP_DIR && sudo chown $SSH_USER:$SSH_USER $APP_DIR"

# Copy files to Raspberry Pi
echo "Copying application files..."
rsync -avz --rsync-path="sudo rsync" -e "$RSYNC_SSH" \
    --exclude 'venv' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    client/ "$SSH_USER@$SSH_HOST:$APP_DIR/"

# Create desktop shortcut
echo "Creating desktop shortcut..."
$SSH_CMD "sudo -u $SSH_USER bash -c 'cat > \"$DESKTOP_DIR/$APP_NAME.desktop\" << EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=Music Pi
Comment=Music Pi Player
Exec=/opt/music-pi/venv/bin/python /opt/music-pi/main.py
Icon=multimedia-player
Terminal=false
Categories=AudioVideo;Player;
StartupNotify=true
EOL'"

# Set desktop file permissions
echo "Setting desktop file permissions..."
$SSH_CMD "sudo chown $SSH_USER:$SSH_USER \"$DESKTOP_DIR/$APP_NAME.desktop\""
$SSH_CMD "sudo chmod +x \"$DESKTOP_DIR/$APP_NAME.desktop\""

# Set permissions after copy
echo "Setting permissions..."
$SSH_CMD "sudo chown -R $SSH_USER:$SSH_USER $APP_DIR"
$SSH_CMD "sudo chmod +x $APP_DIR/main.py"

# Create systemd service file
echo "Creating systemd service..."
$SSH_CMD "sudo tee /etc/systemd/system/$SERVICE_NAME.service << 'EOL'
[Unit]
Description=Music Pi Player
After=network.target

[Service]
Type=simple
User=$SSH_USER
Group=$SSH_USER
WorkingDirectory=$APP_DIR
Environment=DISPLAY=:0
ExecStart=$APP_DIR/venv/bin/python $APP_DIR/main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL"

# Enable and start service
echo "Enabling and starting service..."
$SSH_CMD "sudo systemctl daemon-reload"
$SSH_CMD "sudo systemctl enable $SERVICE_NAME"
$SSH_CMD "sudo systemctl start $SERVICE_NAME"

# Clean up SSH control socket
$SSH_CMD -O exit

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo "The application will start automatically on boot."
echo "You can also start it manually from the desktop shortcut."
echo "To check the service status, run: ssh $SSH_USER@$SSH_HOST 'sudo systemctl status $SERVICE_NAME'"
