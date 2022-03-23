# Phone locker mapping
Phone locker mapping è una soluzione software per le aziende che operano nel settore delle telecomunicazioni
e che si occupano della manutenzione di reti fisse e mobili.
La soluzione offre la digitalizzazione delle informazioni necessarie. Inoltre offre la possibilità agli
operatori di lavorare in maniera smart utilizzando il proprio dispositivo.

## Distribuzione della soluzione in produzione
La soluzione è divisa in due progetti: [back-end](https://github.com/aldominasi/phone-locker-mapping-backend)
e front-end (questo repository)  
Per la distribuzione del software seguire i seguenti passi:
- Scaricare o clonare il back-end
- Eseguire il comando `npm install` per installare i package necessari
- Modificare il file `.env` presente nella root del progetto per inserire l'url del back-end
- Eseguire il comando `npm run build` per compilare il progetto
- Copiare La cartella `dist` nella cartella `public` del back-end

## Avvio della soluzione in modalità sviluppo
Modifica il file `.env` presente nella root del progetto per inserire l'url del back-end.\
Esegui i seguenti comandi:
1. `npm install`
2. `npm run serve`

#LICENZA
Vedi la [licenza](https://github.com/aldominasi/phone-locker-mapping.pwa/blob/main/LICENSE)