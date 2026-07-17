#!/bin/bash
cd /home/igor/Desktop/saas-mvp-funnel
if command -v zenity &> /dev/null; then
    LABEL=$(zenity --entry --title="Создать промокод" --text="Введите имя/метку партнёра:" --width=400)
    if [ -z "$LABEL" ]; then
        exit 0
    fi
    RESULT=$(/home/igor/.nvm/versions/node/v20.19.6/bin/railway run npm run promo:create -- "$LABEL" 2>&1)
    zenity --info --title="Промокод создан" --text="$RESULT" --width=500
else
    read -p "Введите имя/метку партнёра: " LABEL
    if [ -z "$LABEL" ]; then
        exit 0
    fi
    /home/igor/.nvm/versions/node/v20.19.6/bin/railway run npm run promo:create -- "$LABEL"
    echo ""
    read -n 1 -s -r -p "Нажмите любую клавишу для закрытия..."
fi
