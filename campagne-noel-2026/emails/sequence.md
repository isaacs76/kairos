# Séquence email et SMS : Natale Nostro

Outil : Brevo. Expéditeur : « Solenostro ». Tous les liens portent `utm_campaign=noel2026`.
`{{ contact.PRENOM }}` = attribut Brevo (vérifier le nom exact de l'attribut).

---

## Email 1 : avant-première fidèles (lundi 3 novembre, 10h)
**Segment :** clients ayant déjà commandé
**Objet :** {{ contact.PRENOM }}, Noël arrive en avance chez nous ☀️
**Pré-en-tête :** -10 % sur nos coffrets de Noël, rien que pour vous, jusqu'au 9 novembre.

> Ciao {{ contact.PRENOM }},
>
> Avant tout le monde, nous voulions vous montrer notre collection de Noël.
> Cette année, nous l'avons appelée **Natale Nostro** : notre Noël, celui qu'on partage à table, en famille, avec une bonne huile et un vrai vinaigre de Modène.
>
> Trois coffrets, des produits bio sélectionnés directement chez nos producteurs italiens, et une carte écrite à la main pour accompagner chacun d'eux.
>
> **Pour vous remercier de votre fidélité : -10 % avec le code `FAMIGLIA10`, jusqu'au 9 novembre.**
>
> [Découvrir les coffrets]
>
> Grazie mille,
> L'équipe Solenostro

**SMS (même jour, 18h)**, 160 caractères maximum :
`Solenostro : -10% sur nos coffrets de Noël en avant-première, code FAMIGLIA10 jusqu'au 9/11. solenostro.fr/noel STOP 36173`
(vérifier le STOP fourni par Brevo)

---

## Email 2 : lancement public (mardi 10 novembre, 10h)
**Segment :** toute la base
**Objet :** Natale Nostro : le soleil d'Italie sous le sapin 🎄
**Pré-en-tête :** Nos coffrets gourmands et bio sont arrivés. Carte personnalisée offerte.
**Modèle HTML :** [`email-lancement.html`](email-lancement.html)

> Quand décembre est gris, on a besoin d'un peu de soleil.
>
> Nos coffrets de Noël rassemblent ce que l'Italie fait de meilleur : huile d'olive vierge extra bio, vinaigre balsamique de Modène vieilli 10 ans, charcuterie artisanale…
>
> - **Piccolo Sole** (29,90 €) : le petit cadeau qui fait plaisir
> - **Tavola di Natale** (59,90 €) : notre coup de cœur pour la table des fêtes
> - **Gran Natale** (99,90 €) : pour gâter ceux qu'on aime
>
> Emballage kraft, ruban rouge et carte manuscrite offerte. Livraison offerte dès 59 €.
>
> [Choisir mon coffret]

---

## Email 3 : Golden Friday (vendredi 27 novembre, 8h)
**Objet :** Ici, le Black Friday est doré ✨
**Pré-en-tête :** Une huile aromatisée offerte dès 70 €, ce week-end seulement.

> Pas de remises au rabais chez nous : nos producteurs méritent mieux.
>
> À la place, ce week-end, **on vous offre une huile d'olive bio aromatisée à l'orange (250 ml) dès 70 € d'achat.**
> Parfaite sur un carpaccio, un poisson ou… un panettone grillé.
>
> Jusqu'à lundi 30 novembre minuit.
>
> [J'en profite]

**SMS (27/11, 12h) :** `Golden Friday Solenostro : une huile bio a l'orange offerte des 70€, jusqu'a lundi. solenostro.fr/noel STOP 36173`

---

## Email 4 : dernière ligne droite (lundi 14 décembre, 9h)
**Segment :** inscrits n'ayant pas commandé depuis le 3 novembre
**Objet :** Plus que 3 jours pour une livraison avant Noël ⏳
**Pré-en-tête :** Commandez avant le 17 décembre ⚠️, on s'occupe du reste.

> {{ contact.PRENOM }}, le compte à rebours a commencé.
>
> **Pour être livré avant Noël, commandez avant le jeudi 17 décembre à midi.** ⚠️
>
> Vous ne savez pas quoi offrir ? Notre coffret **Tavola di Natale** plaît à tout le monde : les amateurs de cuisine, les beaux-parents, l'hôte qui vous reçoit…
>
> [Commander avant le 17/12]

**SMS (16/12, 12h) :** `Solenostro : derniere chance pour une livraison avant Noel, commandez avant demain midi ! solenostro.fr/noel STOP 36173`

---

## Email 5 : retardataires (vendredi 18 décembre, 9h)
**Objet :** Trop tard pour la livraison ? Pas pour faire plaisir 🎁
**Pré-en-tête :** La carte cadeau Solenostro, reçue en quelques secondes.

> Les colis ne partiront plus à temps, mais le cadeau, si.
>
> **La carte cadeau Solenostro** (25 €, 50 € ou 100 €) arrive par email, prête à imprimer ou à transférer. La personne qui la reçoit compose sa propre table italienne.
>
> [Offrir une carte cadeau]

---

## Bonus : Nouvel An (lundi 28 décembre)
**Objet :** Grazie ! Et pour le 31, on prépare l'apéritivo ?
> Merci pour ce Noël partagé avec nous. Pour le réveillon, voici notre sélection apéritivo : poivrons grillés, saucisson bio, huile aromatisée et un pain bien chaud. Buon anno !
