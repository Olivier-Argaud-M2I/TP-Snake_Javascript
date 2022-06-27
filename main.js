/****************************************************
 * 
 *      declaration des classes
 * 
 * *************************************************/
 



class Element{

    _posX;
    _posY;
    _width;
    _height;
    _color;
    _size;

    get posX(){return this._posX;}
    set posX(posX){this._posX = posX;}
    get posY(){return this._posY;}
    set posY(posY){this._posY = posY;}
    get width(){return this._width;}
    set width(width){this._width = width;}
    get height(){return this._height;}
    set height(height){this._height = height;}
    get color(){return this._color;}
    set color(color){this._color = color;}
    get size(){return this._size;}
    set size(size){this._size = size;}
    
    constructor(posX,posY,width,height,size,color){
        this._posX = posX;
        this._posY = posY;
        this._width = width;
        this._height = height;
        this._color = color;
        this.size = size;
    }
}


 class Serpent extends Element{

    _corp;

    get corp(){return this._corp}
    set corp(corp){this._corp = corp;}

    constructor(posX,posY,width,height,corp,size,color){
        super(posX,posY,width,height,size,color);
        this._corp = corp;
    }
}


/****************************************************
 * 
 *      declaration des variables globales
 * 
 * *************************************************/
 

let debug = false;
let monInter;
let avance = 10;
let largeurCanvas = 300;
let hauteurCanvas = 150;
let ticCount = 0;
let direction = 39;
let btnStart = document.querySelector('#start');
let btnStop = document.querySelector('#stop');
let btnToggle = document.querySelector('#toggle');
let divScore = document.querySelector('#score');
let canvas = document.querySelector('canvas');
let serpent = new Serpent(50,80,10,10,[],5,'rgb(0,255,0)');
let pomme = ajoutPomme();
let ctx = canvas.getContext("2d");
let score = 0;
let vitesse = 150;
let attenteChoix = true;
let border = true;

/****************************************************
 * 
 *      lancement du script
 * 
 * *************************************************/


init();



/****************************************************
 * 
 *      declaration des functions
 * 
 * *************************************************/

// initialisation du jeux et des listeners
function init(){
    dessiner();
    divScore.innerHTML = score;
    ajoutListenerStart();
    ajoutListenerStop();
    ajoutListenerToggle();
    addEventListener('keydown',keyListenerRefresh);
    if(!debug){
        $('#X')[0].setAttribute('hidden',"");
        $('#Y')[0].setAttribute('hidden',"");
    }

}

function ajoutListenerStart(){
    btnStart.addEventListener('click',start);
}

function retirerListenerStart(){
    btnStart.removeEventListener('click',start);
}

function ajoutListenerStop(){
    btnStop.addEventListener('click',stop);
}

function retirerListenerStop(){
    btnStop.removeEventListener('click',stop);
}

function ajoutListenerToggle(){
    btnToggle.addEventListener('click',toggle);
}

function retirerListenerToggle(){
    btnToggle.removeEventListener('click',toggle);
}

// fonction pour lancer une partie
function start(){
    reset();
    retirerListenerStart();
    retirerListenerToggle();
    startInterval();
    btnStart.setAttribute('class','vert');
}
// fonction pour arreter une partie en cours
function stop(){
    stopInterval();
    ajoutListenerStart();
    ajoutListenerToggle();
    btnStart.setAttribute('class','');  
}
// fonction pour reinitialiser le jeux
function reset(){
    serpent =  new Serpent(50,80,10,10,[],5,'rgb(0,255,0)');
    direction = 39;
    score = 0;
    vitesse = 150;
    divScore.innerHTML = score;
}
// fonction pour activer ou descativer l'option bordure 
function toggle(){
    border=!border;
    btnToggle.setAttribute('class',border?'':'vert');
}

// lancement de l'interval et sauvegarde de sa reference dans le document
function startInterval(){
    monInter = setInterval( interval, vitesse);
}
// arret de l'interval
function stopInterval(){
    clearInterval(monInter);
    monInter = "";
}



// memoirisation de l'ordre de direction donné par les fleches directionnelles 
// a condition que celui ci soit valide
function keyListenerRefresh(e){
    if(debug){
        console.log(e.keyCode);
    }
    if(attenteChoix){
        
        switch (e.keyCode) {
            // si on se dirige vers la droite ou la gauche on n'autorise la saisie
            // que pour le haut ou le bas
            case 37:
            case 39:    
                if(direction!==37 && direction!==39){
                    direction = e.keyCode;
                    attenteChoix = false;
                }
                break;
            // si on se dirige vers la haut ou le bas on n'autorise la saisie
            // que pour la droite ou la gauche
            case 38:
            case 40:
                if(direction!==38 && direction!==40){
                    direction = e.keyCode;
                    attenteChoix = false;
                }
                break;
            default:
                break;
        }
    }
}

// fonction qui dessine les differents elements du jeux dans le canvas
function dessiner(){
    // on commence par tout remplir en blanc a chaque cycle
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0,0,300,150);


    // les 4 coins
    if(debug){
        ctx.fillStyle = 'rgb(255,0,0)';

        let cercle = new Path2D();
        cercle.arc(5, 5, 5, 0, 2 * Math.PI);
        ctx.fill(cercle);

        let cercle2 = new Path2D();
        cercle2.arc(295, 145, 5, 0, 2 * Math.PI);
        ctx.fill(cercle2);

        let cercle3= new Path2D();
        cercle3.arc(295, 5, 5, 0, 2 * Math.PI);
        ctx.fill(cercle3);

        let cercle4= new Path2D();
        cercle4.arc(5, 145, 5, 0, 2 * Math.PI);
        ctx.fill(cercle4);
    }
    


    // on dessine la pomme
    try {
        ctx.fillStyle = pomme.color;
        let pom = new Path2D();
        pom.arc(pomme.posX+5,pomme.posY+5,pomme.size,0,2*Math.PI);
        ctx.fill(pom);
    } 
    catch (error) {
        console.log('probleme dessin pomme')
    }
    // box pomme
    if (debug){
        ctx.rect(pomme.posX,pomme.posY,pomme.width,pomme.height);
        ctx.stroke();    
    }
    
    // on dessine chaque elements du corp du serpent
    try {
        for (let i = serpent.corp.length ; i > 0 ; i--) {
            ctx.fillStyle = serpent.corp[i-1].color;
            let corp = new Path2D();
            corp.arc(serpent.corp[i-1].posX+(serpent.corp[i-1].width/2),serpent.corp[i-1].posY+(serpent.corp[i-1].height/2),serpent.corp[i-1].size,0,2*Math.PI);
            ctx.fill(corp);
        }
    } 
    catch (error) {
        console.log('probleme dessin corp serpent')
    }
    
    // on dessine la tete du serpent
    try {
        ctx.fillStyle = serpent.color;
        let serp = new Path2D();
        serp.arc(serpent.posX+5,serpent.posY+5,serpent.size,0,2*Math.PI);
        ctx.fill(serp);
    } 
    catch (error) {
        console.log('probleme dessin tete serpent')
    }
    // box serpent
    if (debug){
        ctx.rect(serpent.posX,serpent.posY,serpent.width,serpent.height);
        ctx.stroke();
    }

}

// on selectionne une valeur de deplacement en X et Y en fonction de la direction validée
function deplacement(){

    switch (direction) {
        case 37:
            move(-avance,0);
            break;
        case 38:
            move(0,-avance);
            break;
        case 39:
            move(avance,0);
            break;
        case 40:
            move(0,avance);
            break;
        default:
            break;
    }
}

// on applique le deplacement au serpent en fonction de l'option bordure
function move(X,Y){
    serpent.posX += X;
    serpent.posY += Y;
    if(border){
        serpent.posX = serpent.posX>largeurCanvas-avance ? 0 : serpent.posX;
        serpent.posY = serpent.posY>hauteurCanvas-avance ? 0 : serpent.posY;
        serpent.posX = serpent.posX<0 ? largeurCanvas-avance : serpent.posX;
        serpent.posY = serpent.posY<0 ? hauteurCanvas-avance : serpent.posY;
    }
}

// on test les differentes collisions possibles
function testCollision(){

    // collision pomme
    if (collision(serpent,pomme)){
        mangePomme();
    }

    // collision corp
    for (let i = 1; i < serpent.corp.length-1; i++) {
        if (collision(serpent,serpent.corp[i])){
            gameOver('you lose');
        }
    }

    // collision bords
    if(!border){
        if(serpent.posX<0 || serpent.posX>largeurCanvas-serpent.width || serpent.posY<0 || serpent.posY>hauteurCanvas-serpent.height){
            gameOver('you lose');
        }
    }
    
}

// si on mange une pomme
function mangePomme(){
    if (debug){
        console.log('miam');
    }
    // on incremente le score et on l'affiche 
    score++;
    divScore.innerHTML = score;
    // si on rempli tout l'ecran avec notre serpent on gagne
    if(score>=((largeurCanvas/10)*(hauteurCanvas/10))-1){
        gameOver('you win');
    }
    // on fait grnadir notre serpent
    ajoutCorp();
    // on place une nouvelle pomme
    pomme = ajoutPomme();
}

// fonction  qui test une collision entre deux rectangle
function collision(rect1,rect2){
    if( rect1.posX < rect2.posX + rect2.width &&
        rect1.posX + rect1.width > rect2.posX &&
        rect1.posY < rect2.posY + rect2.height &&
        rect1.height + rect1.posY > rect2.posY){
        return true;
    }
    return false;
}

// en fin de jeux on log le resultat et on stop le jeux
function gameOver(state){
    console.log(state);
    stop();
}


// gestion des tics
// fonction qui gere l'ordre des differentes action a effectuer a chaque tour
function interval(){
    ticCount++;
    if(debug){
        console.log('tic '+ ticCount);
    }
    // test du changement de vitesse
    changeVitesse();
    // actualisation de l'affichage de la position ( pour le mode debug )
    affichePosition();
    // on raffraichit l'affichage des elements graphiques
    dessiner();
    // on decale les elements du corp du serpent
    decalageCorp();
    // on deplace la tete du serpent
    deplacement();
    // on test d'eventuelles collisions
    testCollision();
    // on reinitialise la possibilitée de saisir une nouvelle direction
    attenteChoix = true;
}

function ajoutPomme(){
    // creation d'une pomme en aleatoire sur la map
    let rand1 = rand(0,((largeurCanvas-avance)/avance))*avance;
    let rand2 = rand(0,((hauteurCanvas-avance)/avance))*avance;
    let pommeTemp = new Element(rand1,rand2,10,10,5,'rgb(255,0,0)');
    if(debug){
        console.log(`pomme apparait en X ${rand1} Y ${rand2}`);
    }
    // tant que la nouvelle pomme est en collision avec le serpent on incremente la position de la pomme et on recommence
    while(clashPomme(pommeTemp)){
        decallagePomme(pommeTemp);
    }
    return pommeTemp;
}

// fonction permettant de decaller la pomme sur la grille 
function decallagePomme(pommeTemp){
    // si il y a de la place a droite on la decalle a droite
    if(pommeTemp.posX < largeurCanvas-avance){
        pommeTemp.posX += avance;
    }
    // sinon on la met au debut de la ligne suivante ou en haut si il n'y a plus de place en bas
    else{
        pommeTemp = 0;
        if(pommeTemp.posY < hauteurCanvas-avance){
            pommeTemp.posY +=5;
        }
        else{
            pommeTemp.posY = 0;
        }
    }
}

// fonction qui test la collision d'un pomme avec le serpent
function clashPomme(pommeTemp){
    serpent.corp.forEach(corp => {
        if(collision(pommeTemp,corp)){
           return true;
        }
    });
    if(collision(pommeTemp,serpent)){
        return true
    }
    return false;
}

// fonction qui fourni un entier aleatoire compris entre min et max inclu
function rand(min,max){
    let rando = Math.floor(Math.random() * (max - min +1)) + min;
    if(debug){
        console.log(`random entre ${min} et ${max} => ${rando}`);
    }
    return rando;
}

// ajout d'un element au corp du serpent
function ajoutCorp(){
    // genere une couleur HSL
    let h = ((score+120)*10)%360;
    let color = `hsl(${h},100%,50%)`
    // on ajoute un element au corp du serpent
    serpent.corp.push(new Element(serpent.posX,serpent.posY,serpent.width,serpent.height,serpent.size,color));

}

// decalage des different elements du corp du serpent
function decalageCorp(){

    try {
        for (let i = serpent.corp.length-1; i >0; i--) {
            serpent.corp[i].posX = serpent.corp[i-1].posX;
            serpent.corp[i].posY = serpent.corp[i-1].posY;
        }
    } catch (error) {
        
    }
    
    try {
        serpent.corp[0].posX = serpent.posX;
        serpent.corp[0].posY = serpent.posY;
    } catch (error) {
        
    }
    
}

// actualisation de l'affichage de la position de la tete du serpent 
function affichePosition(){
    $('#X')[0].innerHTML = 'posX = '+serpent.posX;
    $('#Y')[0].innerHTML = 'posY = '+serpent.posY;
}

// change la vitesse du jeux en fonction du score
function changeVitesse(){

    // premier palier au score de 5
    if(score===5 && vitesse!== 100){
        vitesse = 100;
        stopInterval()
        startInterval()
        return;
    }
    // deuxieme palier au score de 10
    if(score===10 && vitesse!== 75){
        vitesse = 75;
        stopInterval()
        startInterval()
        return;
    }
    // troisieme palier au score de 15
    if(score===15 && vitesse!== 50){
        vitesse = 50;
        stopInterval()
        startInterval()
        return;
    }
    // dernier palier au score de 20
    if(score===20 && vitesse!== 25){
        vitesse = 25;
        stopInterval()
        startInterval()
        return;
    }

}