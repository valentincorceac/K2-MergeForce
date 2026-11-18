| Scenario  | Förväntad status | Förväntat UI | Faktiskt resultat| Godkänd |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Success  | 200/2xx  | Data visas  | Fem API-kort visades. De tre lokala korten låg kvar.  | Ja  |
| Saknas  | 404  | Begripligt meddelande | Rätt meddelande visades, API-listan var tom och knappen återställdes.  | Ja  |
| Serverfel  | 500/5xx  | Försök igen senare  | Rätt meddelande visades. Ett nytt lyckat försök fungerade.  | Ja  |
| Nätverksfel | Ingen status  | Tjänsten kan inte nås  | Ingen status. | Ja  |
