# PlanEat — dokumentacja funkcjonalna

## 1. Cel i zakres
PlanEat to aplikacja webowa wspierająca planowanie posiłków oraz zarządzanie produktami i przepisami. Użytkownik może:
- tworzyć przepisy i przypisywać do nich składniki,
- tworzyć wirtualną kopię lodówki do kontrolowania zapasów,
- tworzyć plany posiłków na wybraną przez użytkownika ilość dni,
- budować listy zakupów (ręcznie lub na podstawie planu),
- oznaczać przepisy jako ulubione.

## 2. Użytkownicy i role

Gość (niezalogowany)
- ma dostęp do stron **Logowanie** i **Rejestracja**,
- po zalogowaniu uzyskuje dostęp do funkcji aplikacji.

Użytkownik (zalogowany)
- korzysta ze wszystkich funkcji aplikacji: składniki, przepisy, ulubione, lodówka, plany posiłków, listy zakupów, profil.

Docelowo ma być dodana jeszcze funkcja administratora lecz nie została ona jeszcze zaimplementowana.

## 3. Moduły funkcjonalne

### 3.1. Autoryzacja i konto
**Cel:** identyfikacja użytkownika oraz przyznanie dostępu do przypisanych danych.

Funkcje:
- **Rejestracja**: utworzenie konta na podstawie `username`, `email`, `password`.
- **Logowanie**: logowanie na podstawie identyfikatora (np. email/login) i hasła.
- **Wylogowanie**: zakończenie sesji w aplikacji.
- **Edycja profilu**: zmiana `username` oraz `password`.

### 3.2. Panel Główny
**Cel:** skrót do głównych obszarów oraz podsumowanie.

Funkcje (przykładowo):
- podgląd podstawowych informacji użytkownika,
- nawigacja do: składników, przepisów, lodówki, planów posiłków, list zakupów.

### 3.3. Składniki
**Cel:** utrzymanie bazy składników używanych w przepisach i na liście zakupów.

Funkcje:
- przegląd listy składników,

### 3.4. Przepisy
**Cel:** tworzenie i utrzymywanie przepisów oraz ich szczegółów.

Funkcje:
- lista przepisów,
- dodanie przepisu,
- podgląd szczegółów przepisu,
- edycja przepisu,
- usunięcie przepisu.

### 3.5. Składniki w przepisach
**Cel:** powiązanie przepisu z listą składników i ilości.

Funkcje:
- dodanie składnika do przepisu z ilością,
- aktualizacja listy składników przepisu,
- usunięcie składnika z przepisu.

### 3.6. Ulubione
**Cel:** szybki dostęp do ulubionych przepisów.

Funkcje:
- dodanie przepisu do ulubionych,
- usunięcie przepisu z ulubionych,
- przegląd listy ulubionych przepisów.

### 3.7. Lodówka
**Cel:** przechowywanie informacji, jakie składniki i w jakich ilościach posiada użytkownik.

Funkcje:
- dodanie składnika do lodówki z ilością,
- aktualizacja ilości składnika,
- usunięcie składnika z lodówki,
- przegląd zawartości lodówki.

### 3.8. Plany posiłków
**Cel:** planowanie posiłków na konkretne dni.

Funkcje:
- utworzenie planu na zakres dni (np. 1–7 dni),
- przegląd planów,
- edycja planu (zmiana nazwy oraz przesunięcie dat),
- usunięcie planu.

### 3.9. Przepisy w planie posiłków (szczegóły planu)
**Cel:** przypisanie konkretnych przepisów do dni w planie.

Funkcje:
- wybór dnia planu,
- dodanie przepisu do danego dnia i konkretnej pory,
- usunięcie przepisu z dnia,
- podgląd listy przepisów przypisanych do planu.

### 3.10. Listy zakupów
**Cel:** przygotowanie listy zakupów na podstawie planów lub ręczne wprowadzanie na listy.

Funkcje:
- utworzenie listy zakupów,
- przegląd list zakupów użytkownika,
- usunięcie listy zakupów,
- przegląd pozycji listy zakupów,
- dodanie pozycji (składnik + ilość),
- usunięcie pozycji.

## 4. Widoki (frontend) i nawigacja
Aplikacja udostępnia następujące widoki:

### 4.1. Logowanie
- formularz logowania,
- po poprawnym logowaniu użytkownik przechodzi do aplikacji.

### 4.2. Rejestracja
- formularz utworzenia konta,
- po rejestracji użytkownik przechodzi do logowania.

### 4.3. Dashboard
- ekran startowy po zalogowaniu.

### 4.4. Składniki
- lista składników,
- dodawanie/edycja/usuwanie (zgodnie z dostępnymi akcjami w UI).

### 4.5. Przepisy
- lista przepisów,
- przejście do szczegółów przepisu.

### 4.6. Szczegóły przepisu
- podgląd danych przepisu,
- zarządzanie składnikami przepisu,

### 4.7. Ulubione
- lista ulubionych przepisów,
- możliwość usunięcia z ulubionych.

### 4.8. Lodówka
- lista składników w lodówce,
- dodawanie/usuwanie składników aktualizacja ilości.

### 4.9. Plan posiłków
- lista planów,
- dodanie nowego planu,
- edycja planu (nazwa i data startu),
- usunięcie planu,
- przejście do szczegółów planu.

### 4.10. Szczegóły planu posiłków
- praca na przepisach w ramach wybranego dnia/zakresu planu,

### 4.11. Listy zakupów
- lista list zakupów,
- podgląd pozycji wybranej listy,
- dodawanie/usuwanie pozycji,
- usuwanie list.

### 4.12. Profil
- podgląd danych konta,
- edycja danych,
- zmiana hasła,
- wylogowanie.

## 5. Model danych — pojęcia i relacje
Najważniejsze encje:
- **User** — konto użytkownika.
- **Ingredient** — składnik/produkt.
- **Recipe** — przepis.
- **RecipeIngredient** — powiązanie przepisu ze składnikiem i ilością.
- **Favorite** — powiązanie użytkownika z ulubionym przepisem.
- **FridgeItem** — stan składnika w lodówce użytkownika.
- **MealPlan** — wpis planu na konkretną datę.
- **MealPlanRecipe** — powiązanie przepisu z konkretnym wpisem planu.
- **ShoppingList** — lista zakupów.
- **ShoppingItem** — pozycja na liście zakupów.

## 6. Instrukcja uruchomienia (skrót)
1. Uruchom backend (wymaga MySQL i pliku `.env`):
   - `npm install`
   - `node src/server.js`
2. Uruchom frontend:
   - `npm install`
   - `npm run dev`
