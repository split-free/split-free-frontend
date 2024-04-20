export const expenses = [
  {
    "id": 1,
    "group": 1,
    "title": "Groceries",
    "description": "Shopping for the week",
    "amount": 102.00,
    "currency": "EUR",
    "created_at": new Date("2024-04-13T08:00:00").toString(),
    "payment_proof": "/path/to/image.jpg",
    "payer": 1,
    "participants": [1, 2, 3],
  },
  {
    "id": 2,
    "group": 2,
    "title": "Movie Night",
    "description": "Tickets and snacks",
    "amount": 40.00,
    "currency": "EUR",
    "created_at": new Date("2024-04-12T08:00:00").toString(),
    "payment_proof": "/path/to/movie_image.jpg",
    "payer": 4,
    "participants": [4, 5],
  },
  {
    "id": 3,
    "group": 3,
    "title": "Dinner Out",
    "description": "Celebration dinner",
    "amount": 75.00,
    "currency": "EUR",
    "created_at": new Date("2024-04-12T09:00:00").toString(),
    "payment_proof": "/path/to/dinner_image.jpg",
    "payer": 6,
    "participants": [6, 7, 8],
  }
];
