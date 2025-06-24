# Random Usless Facts

React SPA з мікросервісною архітектурою. S.T.A.L.K.E.R. тематика.

## Реалізовано

- JSON API через Express proxy
- React компоненти (client-side rendering)
- Детальний перегляд кожного факту
- Форма входу
- AJAX автооновлення кожні 30 сек
- Вікторина з radio/select елементами
- Bootstrap 5 для UI

## Характеристики

- React 18
- Express.js (API Gateway)
- Bootstrap 5
- Webpack
- Random Useless Facts API

## Структура

```
src/
├── components/       # UI компоненти
├── App.js           # Головна логіка
├── index.js         # Entry point
└── styles.css       # Кастомні стилі

server.js            # Express API proxy
webpack.config.js    # Збірка
```

## Запуск

```bash
npm install
npm run build
npm start
```

## Функціонал

- Карткове відображення фактів
- Модалка з повним текстом
- Фейкова авторизація (6+ символів пароль)
- Автооновлення (toggle switch)
- 3-питальна вікторина
- Toast сповіщення

Localhost:5000
