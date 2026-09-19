//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Le broker MQTT est un serveur central qui reçoit les messages envoyés par les objets connectés (capteurs) et les redistribue aux appareils qui souhaitent les recevoir
--------------------------------------------------------------------------------------------------------------------------------------
** Démo 1 (MQTT) : 
 + Terminal 1 (Lancez le broker sans TLS sur le port 1883) : mosquitto -p 1883 -v 
 + Terminal 2 (C'est le capteur qui transmet la température toutes les 3 secondes et Publisher = mosquitto_pub ...): while true; do
  mosquitto_pub -h localhost -p 1883 -t "maison/temperature" -m "22.5"
  sleep 3
done

  + Terminal 3 (Attaquant) : mosquitto_sub -h localhost -p 1883 -t "#" -v (mosquitto_sub -t '#')
   (Vous montrez que l'attaquant peut voir tous les messages parceque se ne pas utilise de TLS.voici : maison/temperature 22.5)
   

« Nous allons maintenant mettre en œuvre la contre-mesure TLS. »
   
Arrêtez le courtier (broker) : Ctrl + C sur le terminal 1
# Lancez le courtier (broker) TLS préparé : mosquitto -c ~/demo-mqtt-tls/mosquitto_tls.conf -v 
(Ensuite, il connecte le client via TLS (port 8883).)
   
#Nous utilisons  le protocole TLS. La connexion est chiffrée, de sorte que les attaquants ne peuvent plus lire les messages.
   
 ** Démo 2 (JWT) :
 Seul un terminal est utilisé pendant la présentation.
# Étape 1 sur nouveau terminal terminal(terminal 4): 
  - cd "/media/amede/Disque/ENI_MASTER/lesona m1 OCC 2026/Securites Web/Projet_Présenter/demo-jwt"
  
# Etape 2 : Ici, je crée un faux JWT avec le rôle d'administrateur.
  - python3 forge_jwt.py pour sortie de JWT forgé : eyJhbGc....
  
  
# Etape 3 :  Pour demander : Colle le JWT forgé ici :
  - python3 serveur_vulnerable.py
  - Collez le JWT.il apparait : ACCÈS ADMIN ACCORDÉ ! // le serveur a accepté le JWT, même s'il ne comporte pas de signature.
  
  
# Etape 4 : Collez uniquement le JWT.Il apparait le Token rejeté
 - python3 serveur_corrige.py
 - le serveur est protégé car il vérifie la signature ainsi que l'algorithme utilisé.

      



