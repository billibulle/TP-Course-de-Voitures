let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

var ligneArrivee = 130;  // position de la ligne d'arrivée
var raceOver = false;  // variable pour savoir si la course est finie
const jsConfetti = new JSConfetti()  // Initialisation de JSConfetti

// Creation de la class Voiture
class Voiture {

    constructor(x, y, imgSrc) {   
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = imgSrc;
    };

    

}
// Methode pour dessiner les voitures sur le canvas
    Voiture.prototype.dessiner = function() {
        ctx.drawImage(this.img, this.x, this.y, 180, 120);
    };

// Creation des Voitures
var car1 = new Voiture(1300, 160, "./img/car1.png");
var car2 = new Voiture(1300, 370, "./img/car2.png");

var imgCar1 = new Image();  // chargement de l'image des voitures
imgCar1.src = "./img/car1.png";
imgCar1.onload = function() {
    car1.dessiner();
};

var imgCar2 = new Image();  // chargement de l'image des voitures
imgCar2.src = "./img/car2.png";
imgCar2.onload = function() {
    car2.dessiner();
};

function dessiner() {       // fonction de dessin des voitures
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    car1.dessiner();
    car2.dessiner();
}

// Methode pour déplacer les voitures à gauche
Voiture.prototype.deplacerAGauche = function(distance,stop) {
    if (!stop) {
        this.x -= distance; // déplacement à gauche
        if (this.x < ligneArrivee) 
            this.x = ligneArrivee;
            dessiner();
            return true; // on arrête la fonction de déplacement si la voiture arrive à gauc
        }
        else {
            this.x = this.x; // on reste sur la même position si dépasse la limite gauche
            return false; // on continue le déplacement
    }
};

function randomDistance() {
    return Math.floor(Math.random() * 16); // nombre aléatoire entre 0 et 15
}

var intervalId;         //  interval id pour le timer


// Fonction qui lance la course
function startRace() {
    raceOver = false;
    let countdown = 3;

    let countdownInterval = setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dessiner(); 
        ctx.font = "140px bebas";
        ctx.fillStyle = "yellow";
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
        countdown--;

        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            intervalId = setInterval(function() {
                if (!raceOver) {
                    
                    car1.deplacerAGauche(randomDistance());
                    car2.deplacerAGauche(randomDistance());
                    dessiner();
                    winner();
                    if (raceOver) {
                        clearInterval(intervalId);
                    }
                }
            }, 20);
        }
    }, 1000); // 1000 milliseconds = 1 second
}

// Fonction qui détecte les touches du clavier
function keyDownHandler(e) {
    if (e.key === "z") {
        car1.deplacerAGauche(randomDistance());
    }
    if (e.key === "p") {
        car2.deplacerAGauche(randomDistance());
    }
    
    if (!raceOver) {
        car1.deplacerAGauche(randomDistance());
        car2.deplacerAGauche(randomDistance());
        dessiner();
        winner();
        if (raceOver) {
            clearInterval(intervalId);
        }
    }
}
//  fonction qui stoppe la course
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
            emojis: ['🦄'],
            emojiSize: 100,
            confettiNumber: 30,
        });
    }
    else if (car2.x <= ligneArrivee) {
        ctx.font = "60px bebas";
        ctx.fillStyle = "blue";
        ctx.fillText("JOUEUR 2 GAGNE LA PARTIE", 400, 440);
        raceOver = true;
        jsConfetti.addConfetti({
            emojis: ['🦖'],
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

document.getElementById('stop').addEventListener('click',stopRace);

document.getElementById('resetButton').addEventListener('click', function () {
    document.location.reload();
});

document.addEventListener("keydown", keyDownHandler);