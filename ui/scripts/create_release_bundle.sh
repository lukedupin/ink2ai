#!/usr/bin/bash

echo "Make sure you run this from the root project directory"
echo ""

echo "rm -rf build"
sudo rm -rf build

npm run build
if [[ $? -ne 0 ]]; then
    echo "Build error"
    exit
fi

echo "rm -rf target"
sudo rm -rf target

echo "mv build target"
mv build target

echo "sudo chown -R www-data:www-data target"
sudo chown -R www-data:www-data target

echo "sudo systemctl restart fast_api.service"
sudo systemctl restart fast_api.service
echo "sudo systemctl restart apache2"
sudo systemctl restart apache2

echo ""
echo "Completed"
