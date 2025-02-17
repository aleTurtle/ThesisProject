import requests
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
from datetime import datetime, timedelta
import pytz
import dateparser #parsa le date e le comprende  
import json
import re  # Per rimuovere i tag HTML


class ActionGetLessons(Action):
    def name(self) -> Text:
        return "action_get_lessons"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: "Tracker",
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Recupera i parametri dal tracker
        start_date_raw = tracker.get_slot("start_date")
        end_date_raw = tracker.get_slot("end_date")
        today = datetime.now(pytz.timezone("Europe/Rome"))

        # Se non sono specificate date, usa default
        if not start_date_raw or not end_date_raw:
            user_message = tracker.latest_message.get('text', '').lower()

            if "oggi" in user_message:
                start_date = today
                end_date = today
            elif "domani" in user_message:
                start_date = today + timedelta(days=1)
                end_date = start_date
            elif "questa settimana" in user_message:
                start_date = today - timedelta(days=today.weekday())
                end_date = start_date + timedelta(days=6)
            elif "questo mese" in user_message:
                start_date = today.replace(day=1)
                end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)
            else:
                start_date = today - timedelta(days=today.weekday())
                end_date = start_date + timedelta(days=6)

        else:
            # Prova a interpretare le date usando dateparser
            start_date = dateparser.parse(start_date_raw, languages=["it"])
            end_date = dateparser.parse(end_date_raw, languages=["it"])
            if not start_date or not end_date:
                dispatcher.utter_message(text="Le date fornite non sono valide. Per favore usa un formato comprensibile.")
                return []

        # Converti le date in formato ISO 8601
        start_date_iso = start_date.astimezone(pytz.timezone("Europe/Rome")).isoformat()
        end_date_iso = end_date.astimezone(pytz.timezone("Europe/Rome")).isoformat()

        # Costruisci l'URL dinamico con i parametri start e end
        base_url = "https://unifare.unicam.it/controller/ajaxController.php"
        url = f"{base_url}?filename=../didattica/controller/orari.php&class=OrariController&method=getDateLezioniByPercorsoCalendar&parametri[]=10028&parametri[]=false&parametri[]=0&start={start_date_iso}&end={end_date_iso}"

        print(f"URL della richiesta: {url}")

        try:
            # Invia la richiesta al server
            response = requests.get(url)
            response.raise_for_status()

            print(f"Risposta del server (status code): {response.status_code}")

            # Analizza la risposta (supponendo sia HTML con dati rilevanti)
            html_content = response.text

            # Parsing dei dati JSON-like contenuti nell'HTML
            start_data_index = html_content.find('[')
            end_data_index = html_content.rfind(']') + 1

            if start_data_index != -1 and end_data_index != -1:
                raw_json_data = html_content[start_data_index:end_data_index]
                try:
                    lessons = json.loads(raw_json_data)  # Converte in formato JSON
                    print(f"Dati elaborati: {lessons}")

                    # Funzione per pulire i dati HTML
                    def clean_html(raw_html):
                        # Rimuove i tag HTML
                        clean_text = re.sub(r'<[^>]+>', '', raw_html)
                        return clean_text.strip()

                    # Costruisci il messaggio per l'utente
                    if lessons:
                        message = f"Ecco le lezioni disponibili dal {start_date.strftime('%d %B')} al {end_date.strftime('%d %B')}:\n"
                        for lesson in lessons:
                            title = lesson.get("title", "Titolo non disponibile")
                            description_raw = lesson.get("description", "Descrizione non disponibile")
                            description = clean_html(description_raw)  # Pulisci la descrizione
                            start = datetime.fromtimestamp(lesson["start"] // 1000).strftime('%d %B %Y, %H:%M')
                            end = datetime.fromtimestamp(lesson["end"] // 1000).strftime('%H:%M')
                            year = lesson.get("anno", "Anno non specificato")

                            message += (
                                f"- {title}: {description}. "
                                f"Inizio: {start}, Fine: {end}.\n"
                                f"Anno: {year}\n"
                            )
                    else:
                        message = f"Non ci sono lezioni programmate dal {start_date.strftime('%d %B')} al {end_date.strftime('%d %B')}."

                except json.JSONDecodeError as e:
                    message = f"Errore nel parsing del JSON dai dati HTML: {str(e)}"

            else:
                message = "Errore: non è stato possibile trovare i dati rilevanti nell'HTML ricevuto."

        except requests.exceptions.RequestException as e:
            message = f"Errore di rete durante la richiesta delle lezioni: {str(e)}"

        dispatcher.utter_message(text=message)
        return []


class ActionProvideCourseInfo(Action):
    def name(self) -> Text:
        return "action_provide_course_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: "Tracker",
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Log per debug
        print("Ciao sono Dave")

        # Risposta dell'azione
        dispatcher.utter_message(text="Sto recuperando le informazioni del corso richiesto.")

        return []



class ActionGetLessonsByYear(Action):
    def name(self) -> Text:
        return "action_get_lessons_by_year"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: "Tracker",
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Recupera l'anno richiesto dall'utente (ad esempio, "anno 1", "anno 2", "anno 3")
        anno_utente = next(tracker.get_latest_entity_values("year"), None)

        if not anno_utente:
            dispatcher.utter_message(text="Non sono riuscito a capire a quale anno ti riferisci. Per favore, specifica l'anno (ad esempio, 'anno 1').")
            return []

        # Converti l'anno in formato numerico, se necessario
        try:
            anno_utente = int(anno_utente)
        except ValueError:
            dispatcher.utter_message(text="L'anno specificato non è valido.")
            return []

        # Chiama l'azione ActionGetLessons per ottenere tutte le lezioni
        action_get_lessons = ActionGetLessons()
        lessons = action_get_lessons.run(dispatcher, tracker, domain)  # Ottieni tutte le lezioni

        # Filtra le lezioni per l'anno richiesto
        lezioni_filtrate = []
        for lesson in lessons:
            if lesson.get("year") == anno_utente:
                lezioni_filtrate.append(lesson)

        # Costruisci il messaggio da inviare all'utente
        if lezioni_filtrate:
            message = f"Ecco le lezioni disponibili per l'anno {anno_utente}:\n"
            for lesson in lezioni_filtrate:
                title = lesson.get("title", "Titolo non disponibile")
                description_raw = lesson.get("description", "Descrizione non disponibile")
                description = clean_html(description_raw)  # Pulisci la descrizione
                start = datetime.fromtimestamp(lesson["start"] // 1000).strftime('%d %B %Y, %H:%M')
                end = datetime.fromtimestamp(lesson["end"] // 1000).strftime('%H:%M')
                
                message += (
                    f"- {title}: {description}. "
                    f"Inizio: {start}, Fine: {end}.\n"
                    f"Anno: {anno_utente}\n"
                )
        else:
            message = f"Non ci sono lezioni per l'anno {anno_utente} nel periodo richiesto."

        # Rispondi all'utente
        dispatcher.utter_message(text=message)
        return []
