fx_version 'cerulean'
game 'gta5'

author 'FiveMDev_99'
description 'Advanced Fuel & Electric Charging System for QBCore & ESX'
version '1.1.2'

ui_page 'html/index.html'

shared_scripts {
    'config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua'
}

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}

lua54 'yes'
