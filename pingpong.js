// Función principal que inicializa los parámetros y comienza el bucle del juego
function principal() {
    inicializa_parametros();
    keys = new KeyListener();
    video1.play();
    video2.play();
    setTimeout(function () {
        if (hay_sonido == true) {
            song.play();
        }
    }, 1500);
    bucle();
}

// Inicializa los parámetros del juego, incluyendo sonidos, canvas, bola, palas y teclas
function inicializa_parametros() {
    // sonidos
    beep1 = new Audio("beep1.wav");
    beep2 = new Audio("beep2.wav");
    lose = new Audio("hit.wav");
    song = new Audio("badapple8bits.mp3");
    video1 = document.getElementById("video1");
    video2 = document.getElementById("video2");

    hay_sonido = false;

    // canvas
    canvas = document.getElementById("campo");
    ancho_canvas = canvas.width;
    alto_canvas = canvas.height;
    context = canvas.getContext("2d");

    // bola
    x = ancho_canvas / 2;
    y = alto_canvas / 2;
    ancho_pelota = 20;
    alto_pelota = 20;
    inc_pelota = 1;
    incX = inc_pelota;
    incY = inc_pelota;
    calcula_color = true;

    // pala
    separacion = 12;
    alto_pala = alto_canvas / 5;
    ancho_pala = 10;
    inc_pala = 2;
    jiX = separacion;
    jiY = alto_canvas / 2 - alto_pala / 2;
    jdX = ancho_canvas - separacion - ancho_pala;
    jdY = jiY;

    // KeyListener
    KEY_I_ARRIBA_U = "A".charCodeAt(0);
    KEY_I_ARRIBA_L = "a".charCodeAt(0);
    KEY_I_ABAJO_U = "Z".charCodeAt(0);
    KEY_I_ABAJO_L = "z".charCodeAt(0);
    KEY_D_ARRIBA_U = "K".charCodeAt(0);
    KEY_D_ARRIBA_L = "k".charCodeAt(0);
    KEY_D_ABAJO_U = "M".charCodeAt(0);
    KEY_D_ABAJO_L = "m".charCodeAt(0);
    PI_ARRIBA = false;
    PI_ABAJO = false;
    PD_ARRIBA = false;
    PD_ABAJO = false;

    inicio_partida();
}

// Dibuja el campo de juego
function dibuja_campo() {
    context.fillStyle = "red";
    context.clearRect(0, 0, ancho_canvas, alto_canvas);
    context.fillRect(ancho_canvas / 2, 0, 2, alto_canvas);
}

// Calcula las nuevas coordenadas de la pelota y detecta colisiones
function calcula_coordenadas_pelota() {
    x += incX;
    y += incY;
    if (y >= jiY && y <= jiY + alto_pala - 1) {
        if (x <= jiX + ancho_pala) {
            incX = -incX;
            incX *= 1.2;
            incY *= 1.1;
            x = jiX + ancho_pala;
            calcula_color = true;
            if (hay_sonido) beep1.play();
        }
    } else {
        if (x < jiX - separacion) {
            inicio_punto();
            puntosD++;
            if (hay_sonido) lose.play();
        }
    }
    if (y >= jdY && y <= jdY + alto_pala - 1) {
        if (x + ancho_pelota >= jdX) {
            incX = -incX;
            incX *= 1.2;
            incY *= 1.1;
            x = jdX - ancho_pelota;
            calcula_color = true;
            if (hay_sonido) beep1.play();
        }
    } else {
        if (x + ancho_pelota > jdX + separacion) {
            inicio_punto();
            puntosI++;
            if (hay_sonido) lose.play();
        }
    }
    if (y + alto_pelota > alto_canvas || y < 0) {
        if (hay_sonido) beep2.play();
        incY = -incY;
        calcula_color = true;
    }
}

// Dibuja la pelota en el canvas
function dibuja_pelota(x, y) {
    // if (calcula_color) {
    //     c1 = Math.floor(Math.random() * 255 + 1);
    //     c2 = Math.floor(Math.random() * 255 + 1);
    //     c3 = Math.floor(Math.random() * 255 + 1);
    //     calcula_color = false;
    // }
    // context.fillStyle = "rgb(" + c1 + "," + c2 + "," + c3 + ")";
    // context.fillRect(x, y, ancho_pelota, alto_pelota);
    image = document.createElement("img");
    image.src = "ball.png";

    context.drawImage(image, x, y, ancho_pelota, alto_pelota);
}

// Dibuja la pala del jugador izquierdo
function dibuja_jugadorI(jiX, jiY) {
    context.fillStyle = "grey";
    context.fillRect(jiX, jiY, ancho_pala, alto_pala);
}

// Dibuja la pala del jugador derecho
function dibuja_jugadorD(jdX, jdY) {
    context.fillStyle = "grey";
    context.fillRect(jdX, jdY, ancho_pala, alto_pala);
}

// Clase para manejar las teclas presionadas
function KeyListener() {
    this.pressedKeys = [];
    this.keydown = function (e) {
        this.pressedKeys[e.keyCode] = true;
    };
    this.keyup = function (e) {
        this.pressedKeys[e.keyCode] = false;
    };
    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
}

// Verifica si una tecla está presionada
KeyListener.prototype.isPressed = function (key) {
    return this.pressedKeys[key] ? true : false;
};

// Calcula las nuevas coordenadas de las palas
function calcula_coordenadas_pala() {
    if (PI_ARRIBA == true) {
        jiY -= inc_pala;
        if (jiY < 0) jiY = 1;
        PI_ARRIBA = false;
    }
    if (PI_ABAJO == true) {
        jiY += inc_pala;
        if (jiY + alto_pala > alto_canvas) jiY = alto_canvas - alto_pala;
        PI_ABAJO = false;
    }
    if (PD_ARRIBA == true) {
        jdY -= inc_pala;
        if (jdY < 0) jdY = 1;
        PD_ARRIBA = false;
    }
    if (PD_ABAJO == true) {
        jdY += inc_pala;
        if (jdY + alto_pala > alto_canvas) jdY = alto_canvas - alto_pala;
        PD_ABAJO = false;
    }
}

// Controla las pulsaciones de teclas para mover las palas
function controlar_pulsacion() {
    if (keys.isPressed(KEY_I_ABAJO_U || KEY_I_ABAJO_L)) {
        PI_ABAJO = true;
    } else if (keys.isPressed(KEY_I_ARRIBA_U || KEY_I_ARRIBA_L)) {
        PI_ARRIBA = true;
    }

    if (keys.isPressed(KEY_D_ABAJO_U || KEY_D_ABAJO_L)) {
        PD_ABAJO = true;
    } else if (keys.isPressed(KEY_D_ARRIBA_U || KEY_D_ARRIBA_L)) {
        PD_ARRIBA = true;
    }
    calcula_coordenadas_pala();
}

// Inicializa un nuevo punto
function inicio_punto() {
    inicioY = Math.floor((Math.random() * alto_canvas) / 2 + 1);
    x = ancho_canvas / 2;
    y = inicioY;
    valorX = Math.floor(Math.random() * 100 + 1);
    if (valorX < 50) {
        incX = inc_pelota;
    } else {
        incX = -inc_pelota;
    }
    valorY = Math.floor(Math.random() * 100 + 1);
    if (valorY < 50) {
        incY = inc_pelota;
    } else {
        incY = -inc_pelota;
    }
    jiX = separacion;
    jdX = ancho_canvas - separacion - ancho_pala;
}

// Inicializa una nueva partida
function inicio_partida() {
    puntosI = 0;
    puntosD = 0;
    inicio_punto();
}

// Dibuja la puntuación en el canvas
function dibuja_puntuacion() {
    context.fillStyle = "gray";
    context.font = "48px Comic Sans MS";
    context.fillText(puntosI, ancho_canvas / 4, 50);
    context.fillText(puntosD, (ancho_canvas * 3) / 4, 50);
}

// Bucle principal del juego que actualiza y dibuja todos los elementos
function bucle() {
    hay_sonido = document.getElementById("sonido").checked;
    dibuja_campo();
    calcula_coordenadas_pelota();
    controlar_pulsacion();
    dibuja_pelota(x, y);
    dibuja_jugadorI(jiX, jiY);
    dibuja_jugadorD(jdX, jdY);
    dibuja_puntuacion();
    setTimeout(bucle, 4);
}

started = false;

// Inicia el juego
document.addEventListener("keydown", (e) => {
    if (!started) {
        principal();
        started = !started;
    }
});
