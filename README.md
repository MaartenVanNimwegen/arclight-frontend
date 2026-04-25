# Arclight - Frontend (React)

Arclight is een modern, krachtig blogsysteem ontworpen als een centraal platform voor **owned media**. Dit frontend-project vormt de interactieve interface voor zowel content creators als lezers.

## 1. Projectoverzicht

Dit is de Single Page Application (SPA) voor het Arclight-platform. Het doel is om een vloeiende, app-achtige ervaring te bieden die de drempel om content te schrijven en te consumeren minimaliseert.

### Kernfunctionaliteiten

- **Content Beheer (Dashboard):** Een intuïtieve interface voor de creator om artikelen te schrijven (CRUD), categoriseren en publiceren.
- **Lezersomgeving:** Een dynamische omgeving waar bezoekers artikelen kunnen lezen, zoeken en filteren op categorie (bijv. Tech, Natuur, Lifestyle).
- **Interactie:** Mogelijkheid voor ingelogde gebruikers om reacties te plaatsen.
- **Nieuwsbrief:** Sectie voor bezoekers om zich in te schrijven voor updates.

## 2. Tech Stack

- **Framework:** React
- **Styling:** Tailwind CSS (voor een moderne, responsieve UI)
- **Data-afhandeling:** Communicatie met de .NET API via JSON
- **Architectuur:** Single Page Application (SPA) voor optimale snelheid en gebruikerservaring.

## 3. Requirements & Kwaliteit

- **NFR2:** De website moet binnen 2 seconden laden op een breedbandverbinding.
- **Responsiveness:** Volledig toegankelijk op verschillende schermformaten.
- **Authenticatie:** Rolgebaseerde toegang (Admin, Creator, Lezer).

## 4. Installatie

1. Clone de repository:
   `git clone https://github.com/MaartenVanNimwegen/arclight-frontend.git`
2. Installeer afhankelijkheden:
   `npm install`
3. Start de applicatie:
   `npm start`