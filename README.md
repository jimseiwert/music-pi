# Hockey Game Music Player

A touch-friendly music player system for hockey games, consisting of a Raspberry Pi client and web admin interface.

## Features

### Raspberry Pi Client
- Touch-friendly interface optimized for hockey game environments
- Category-based music organization
- Play tracking and history
- Local operation (no internet required)
- Auto-start capability
- Supabase storage integration for music files

### Web Admin Interface
- Song management (add/remove/edit)
- Category management
- Play history tracking
- Reset play flags
- Supabase storage integration

## Setup

### Prerequisites
- Raspberry Pi (3 or newer recommended)
- Python 3.8+
- VLC media player
- Web browser (for admin interface)
- Supabase account

### Supabase Setup
1. Create a new Supabase project
2. Create a new storage bucket named 'music-files'
3. Set the bucket's privacy settings to public
4. Get your Supabase URL and anon key from the project settings

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd music-pi
```

2. Create and configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up the database:
```bash
python scripts/setup_db.py
```

5. Configure auto-start:
```bash
sudo cp scripts/music-player.service /etc/systemd/system/
sudo systemctl enable music-player
sudo systemctl start music-player
```

### Running the Application

#### Raspberry Pi Client
The client will start automatically on boot. To start manually:
```bash
python client/main.py
```

#### Web Admin Interface
```bash
python admin/app.py
```
Access the admin interface at `http://localhost:5000`

## Directory Structure
```
music-pi/
├── client/             # Raspberry Pi client application
├── admin/             # Web admin interface
├── database/          # Database files and migrations
├── scripts/           # Setup and utility scripts
├── utils/            # Utility modules
└── config.py         # Configuration file
```

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.