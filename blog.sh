#!/bin/bash

# define colors
red='\e[0;31m'
green='\e[0;32m'
yellow='\e[0;33m'
endColor='\e[0m'

echo -e "${yellow}pull blog code...${endColor}"

cd /home/www/blog/public
git pull

echo -e "${green}success!${endColor}"
