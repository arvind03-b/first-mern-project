# VPS Par Docker ke Saath Deployment Guide (Apache Version)

Kyunki aapke VPS par pehle se **Apache** chal raha hai, toh hum Docker containers ko alag ports (Frontend: 3000, Backend: 5000) par run karenge aur Apache ko ek "Reverse Proxy" ki tarah use karenge, taaki jab koi aapki website (jaise `yourdomain.com`) par aaye, toh Apache traffic ko sahi Docker container tak bhej de.

## Step 1: VPS Par Git aur Docker Install Karein
Apne VPS server mein SSH se login karein (jaise: `ssh root@aapka-ip`) aur yeh commands run karein:

**1. Git Install Karein:**
```bash
sudo apt update
sudo apt install git -y
```

**2. Docker aur Docker Compose Install Karein:**
```bash
# Docker install karein
sudo apt install docker.io -y

# Docker Compose install karein
sudo apt install docker-compose -y

# Docker ko background me run karein aur startup pe enable karein
sudo systemctl start docker
sudo systemctl enable docker
```

## Step 2: VPS Par Project Clone Karein (Pehli Baar)
```bash
# Apne home directory me jayein
cd ~

# Apna GitHub repository clone karein
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Clone hone ke baad folder ka path note kar lein, jaise /root/FIRST-MERN-PROJECT
```
*Note:* `.github/workflows/ci-cd.yml` file mein `cd /path/to/your/FIRST-MERN-PROJECT` ko apne is exact path se replace kar lein aur GitHub par push kar dein.

## Step 3: Apache ko Reverse Proxy banayein
Kyunki Apache Port 80 use kar raha hai, aapko Apache ko batana hoga ki website ka traffic Docker ko bheje.

**1. Proxy modules enable karein:**
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

**2. Apache Virtual Host configure karein:**
Apni website ke liye ek config file banayein:
```bash
sudo nano /etc/apache2/sites-available/mern-app.conf
```
Aur usme yeh paste karein (apna domain name change karein):
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    # ServerAlias www.yourdomain.com

    # Frontend traffic ko Docker (Port 3000) par bhejein
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # (Optional) Agar backend API ka alag route hai, jaise /api
    # ProxyPass /api http://localhost:5000/api
    # ProxyPassReverse /api http://localhost:5000/api
</VirtualHost>
```

**3. Site ko enable karein aur Apache reload karein:**
```bash
sudo a2ensite mern-app.conf
sudo systemctl reload apache2
```

## Step 4: GitHub me Secrets Add Karein (Auto-Deployment ke liye)
1. Apne GitHub Repository > **Settings** > **Secrets and variables** > **Actions** par jayein.
2. **New repository secret** par click karein aur yeh details dalein:
   - `VPS_HOST`: Aapke VPS ka IP address
   - `VPS_USERNAME`: Aapke VPS ka username (jaise: `root`)
   - `VPS_SSH_KEY`: Aapki Private SSH Key (agar SSH key nahi hai, toh `ci-cd.yml` me password use karein aur yahan `VPS_PASSWORD` dalein).

## Step 5: Auto-Deployment Start!
Ab jab bhi aap apne computer se naya code likh kar `git push` karenge:
1. GitHub Actions aapke code ko check (test) karega.
2. VPS me automatically login karke naya code pull karega.
3. `docker-compose up -d --build` run karega.
4. Naya version aapke VPS par live ho jayega, aur Apache usey serve karne lagega!
