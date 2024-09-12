const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ligneArrivee = 150; // position de la ligne d'arrivée
let raceOver = false; // variable pour savoir si la course est finie
const jsConfetti = new JSConfetti(); // Initialisation de JSConfetti

// Classe Voiture
class Voiture {
    constructor(x, y, imgSrc) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = imgSrc;
    }

    dessiner() {
        ctx.drawImage(this.img, this.x, this.y, 180, 120);
    }

    deplacerAGauche(distance) {
        if (!raceOver) {
            this.x -= distance; // déplacement à gauche
            if (this.x < ligneArrivee) {
                this.x = ligneArrivee;
                dessiner();
                return true; // on arrête la fonction de déplacement si la voiture arrive à gauche
            }
            dessiner();
            return false; // on continue le déplacement
        }
        return false;
    }
}

// Création des Voitures
const car1 = new Voiture(1300, 160, "./img/car1.png");
const car2 = new Voiture(1300, 370, "./img/car2.png");

car1.img.onload = () => car1.dessiner();
car2.img.onload = () => car2.dessiner();

function dessiner() { // fonction de dessin des voitures
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    car1.dessiner();
    car2.dessiner();
}

function randomDistance() {
    return Math.floor(Math.random() * 16); // nombre aléatoire entre 0 et 15
}

let intervalId; // interval id pour le timer

// // Fonction qui lance la course
// function startRace() {
//     raceOver = false;
//     let countdown = 3;

//     // Affichage du compte à rebours
//     const countdownInterval = setInterval(() => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         dessiner();
//         ctx.font = "140px bebas";
//         ctx.fillStyle = "yellow";
//         ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
//         countdown--;  // décrémentation du compte à rebours

//         // compte à zéro, début de la course
//         if (countdown < 0) {
//             clearInterval(countdownInterval);
//             intervalId = setInterval(() => {
//                 if (!raceOver) {
//                     car1.deplacerAGauche(randomDistance());
//                     car2.deplacerAGauche(randomDistance());
//                     dessiner();
//                     winner();
//                     if (raceOver) {
//                         clearInterval(intervalId);
//                     }
//                 }
//             }, 20);
//         }
//     }, 1000); // 1000 milliseconds = 1 second
// }



// Fonction qui lance le compte à rebours et la course
function startRace() {
    raceOver = false;
    countdownOver = false;
    let countdown = 3;

    // Désactiver le bouton "go"
    document.getElementById('go').disabled = true;

    // Affichage du compte à rebours
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dessiner();
        ctx.font = "140px bebas";
        ctx.fillStyle = "yellow";
        ctx.fillText(countdown, canvas.width / 2 - 70, canvas.height / 2);
        countdown--;  // décrémentation du compte à rebours

        // compte à zéro, début de la course
        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownOver = true;

            // Réactiver le bouton "go"
            document.getElementById('go').disabled = false;
        }
    }, 1000); // 1000 milliseconds = 1 second
}

// Fonction qui détecte les touches du clavier
function keyDownHandler(e) {
    if (countdownOver && !raceOver) {
        if (e.key === "z") {
            car1.deplacerAGauche(randomDistance());
        }
        if (e.key === "p") {
            car2.deplacerAGauche(randomDistance());
        }
        dessiner();
        winner();
    }
}
// Fonction qui stoppe la course
function stopRace() {
    clearInterval(intervalId);
    raceOver = true;
}

// Fonction qui détermine le gagnant
function winner() {
    if (car1.x <= ligneArrivee) {
        ctx.font = "60px bebas";
        ctx.fillStyle = "red";
        ctx.fillText("JOUEUR 1 GAGNE LA PARTIE", 400, 230);
        raceOver = true;
        jsConfetti.addConfetti({
            emojis: ['🦄', '🏆'],
            emojiSize: 100,
            confettiNumber: 30,
        });
    } else if (car2.x <= ligneArrivee) {
        ctx.font = "60px bebas";
        ctx.fillStyle = "blue";
        ctx.fillText("JOUEUR 2 GAGNE LA PARTIE", 400, 440);
        raceOver = true;
        jsConfetti.addConfetti({
            emojis: ['🦖', '🥳'],
            emojiSize: 100,
            confettiNumber: 30,
        });
    }
    
    if (raceOver==true) {
        document.getElementById('go').style.display = 'none';
        document.getElementById('stop').style.display = 'none';
        document.getElementById('resetButton').style.display = 'block';
    }
}

// Ajout des écouteurs d'événements
document.getElementById('go').addEventListener('click', startRace);
document.getElementById('stop').addEventListener('click', stopRace);
document.getElementById('resetButton').addEventListener('click', () => document.location.reload());
document.addEventListener("keydown", keyDownHandler);
