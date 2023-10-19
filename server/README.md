pip3 install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu121

pip install --upgrade diffusers transformers accelerate scipy ftfy safetensors
segno
segno-pil
pillow
omegaconf


# Code Layout

### data/
* Contains training nets

### ephae/
* Contains the ePhae core library

### pysite/
* settings.py - Defines the settings for the server. FastAPI settings at the bottom
* urls.py - Defines the routes for the server (Django, not FastAPI)

### website/
* admin.py - Defines scaffolding for the admin panel
* api/* - Defines the API endpoints. FastAPI
* helpers/* - Defines helper functions: email, sms, fcm, s3, utililty
* migrations/* - Django database migrations
* models/* - Defines the database models. common.py functions are used by all models
* static/* - Static files

# System setup

**Configure the react app**
```sh
cd ui
npm install
```

**Configure python server**
```sh
sudo apt install uvicorn

cp pysite/example.settings.py pysite/settings.py

# Install for training libs
pip install -r training_requirements.txt
# Server setup to just run
pip install -r requirements.txt
```


# Production Server

## Clean system setup

    sudo apt update && sudo apt upgrade
    sudo apt install zsh zsh-syntax-highlighting zsh-autosuggestions apache2 postgresql-all python3 python3-pip memcached git vim curl ipython3 libapache2-mod-wsgi-py3 snapd uvicorn

    sudo sh -c "curl -fsSL https://deb.nodesource.com/setup_19.x | bash -"
    sudo apt install -y nodejs

    sudo ln -s /usr/bin/python3 /usr/bin/python

    useradd -d /home/ldupin -m -s /usr/bin/zsh ldupin
    passwd ldupin

    vi /etc/group
    #sudo
    #www-data
    #admin

## Clone the code on local

    # git clone react and server
    # Upload the code to the server
    # Now you can configure keys to cloning on the server

## Setup react

    npm install

## Setup server
    cp example.settings.js settings.js
    ## Configure username / PWD, settings etc in the settings.js

    pip3 install -r requirements.txt

## Configure DATABASE based on django docs. For postgres install postgres

    sudo apt install postgresql-all

    # Switch to postgres user for "admin" access
    sudo su - postgres

    # Create a super user
    createuser --interactive -P
    #USERNAME
    #PASSWORD
    #Y Superuser

    # Create databases
    psql
    create database USERNAME;
    create database beenthere;
    create database beenthere_test;
    \q

    # Test the database
    exit # Go back to your user
    psql # Confirm you login
    \q

Setup postgres to support TCP connections. Edit /etc/postgresql/13/main/postgresql.conf

    #Uncomment listen_address
    listen_addresses = 'localhost' # what IP address(es) to listen on;

Restart postgres

    sudo systemctl restart postgresql

Setup the config, edit setting.js:

    # Setup username
    # Setup password

Setup the config, edit setting.py:

    cd admin/pysiste
    cp example.settings.py settings.py

    NAME is the database name (beenthere)
    USER is the USERNAME you just created
    PASSWORD is the password
    HOST and PORT are only needed if the database is on a remote server.


Migrate the database, collect assets for admin interface and create your first NftMiner user

    python3 manage.py migrate
    python3 manage.py collectstatic
    python3 manage.py createsuperuser

## Production apache2

SSL setup through Let's Encrypt. Assuming you're running Ubuntu 20.04+ with Apache2+

    # Update snap
    sudo snap install core; sudo snap refresh core

    # Clean any certbot that might exist (Okay to have errors on this command)
    sudo apt-get remove certbot, sudo dnf remove certbot, or sudo yum remove certbot

    # Install certbot
    sudo snap install --classic certbot
    sudo ln -s /snap/bin/certbot /usr/bin/certbot

Install your SSL certs

    # Run certbot interactively
    sudo certbot --apache --cert-name ink2ai.com 

Setup the apache models and config file:

```
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel

Edit /etc/apache2/sites-enabled/000-default-le-ssl.conf. Below CustomLog, insert the following:
Copy 000-redirect_http.conf into /etc/apache2/sites-available and enable it
```

Confirm your ssl renewal works

    sudo certbot renew --dry-run

First server run, ensure your system can work

    cd /opt/patent/server
    make run
    # If you get an "NVIDIA" error, edit pysite/settings.py, change DEVICE="cpu"

Ensure there is a systemd service for certbot

    systemctl list-units --all --type=service

    # Look for
    snap.certbot.renew.service                     loaded    inactive dead    Service for snap application certbot.renew

Common errors

If you get a "peer connection error" either the postgres isn't listening on TCP or the password is wrong.
Reset the user's postgres password. Restart the services. Confirm postgres is listening on localhost.

## Installing scripts

Note the scripts assuming your installation location is /opt/patent

    cd /opt/patent/server/systemd
    sudo cp fast_api.* /etc/systemd/system

# Configuring the scripts

Below will start the script timers, and configure the timers to run on-boot

    sudo systemctl start fast_api
    sudo systemctl enable fast_api


## Development


**Running the server/react**
```sh
# Run the server
cd server
make dev

# Run the local dev environment
cd ui
npm run start
```

Note: This runs the API with `uvicorn`, and will poll your directory for filechanges. There's something screamingly inefficient about how stock `uvicorn`  polls, so you must `pip install uvicorn[standard]` to [fix](https://www.uvicorn.org/settings/) it.

**AMD setup**
```
apt-get install
rocm-clang-ocl 5.4.3-1
rocm-cmake 5.4.3-1
rocm-core 5.4.3-4
rocm-device-libs 5.4.3-1
rocm-hip-libraries 5.4.3-2
rocm-hip-runtime 5.4.3-2
rocm-hip-sdk 5.4.3-2
rocm-language-runtime 5.4.3-2
rocm-llvm 5.4.3-1
rocm-opencl-runtime 5.4.3-1
rocm-smi-lib 5.4.3-1
rocminfo 5.4.3-1

```


## Building Big_Patent

```
python manage.py migrate
python manage.py ingest_big_patents
python manage.py gen_embed_big_patents
python manage.py build_indexes_big_patents

```
