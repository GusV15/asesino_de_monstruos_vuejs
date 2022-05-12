new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        reiniciarData() {
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.reiniciarData();
        },
        atacar: function () {
            const danio = this.calcularHeridas({ min: this.rangoAtaque[0], max: this.rangoAtaque[1] });
            this.saludMonstruo -= danio;
            this.registrarEvento({
                esJugador: true,
                text: `El jugador atacó al monstruo por ${danio}`
            })
            if (this.verificarGanador()) return;
            this.ataqueDelMonstruo();
        },
        ataqueEspecial: function () {
            const danio = this.calcularHeridas({ min: this.rangoAtaqueEspecial[0], max: this.rangoAtaqueEspecial[1] });
            this.saludMonstruo -= danio;
            this.registrarEvento({
                esJugador: true,
                text: `El jugador atacó al monstruo por ${danio}`
            })
            if (this.verificarGanador()) return;
            this.ataqueDelMonstruo();
        },
        curar: function () {
            if (this.saludJugador >= 100) {
                alert('Ya tiene la salud al máximo!')
            } else {
                this.saludJugador <= 90 ? this.saludJugador += 10 : this.saludJugador = 100;
                this.registrarEvento({
                    esJugador: true,
                    text: `El jugador se curó por 10`
                })
                this.ataqueDelMonstruo();
            }
        },
        registrarEvento(evento) {
            this.turnos.push(evento);
        },
        abandonarPartida() {
            if (confirm('¿Estás seguro de rendirte?')) {
                this.hayUnaPartidaEnJuego = false;
                this.reiniciarData();
            } else {
                return;
            }
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
            this.reiniciarData();
        },
        ataqueDelMonstruo: function () {
            const danio = this.calcularHeridas({ min: this.rangoAtaqueDelMonstruo[0], max: this.rangoAtaqueDelMonstruo[1] });
            this.saludJugador -= danio;
            this.registrarEvento({
                esJugador: false,
                text: `El monstruo atacó al jugador por ${danio}`
            })
            this.verificarGanador();
        },
        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random() * rango.max) + 1, rango.min);
        },
        verificarGanador: function () {
            if (this.saludMonstruo < 1) {
                if (confirm('Ganaste, ¿Querés jugar de nuevo?')) {
                    this.empezarPartida();
                } else {
                    this.terminarPartida();
                }
                return true;
            } else if (this.saludJugador < 1) {
                if (confirm('Perdiste, ¿Querés jugar de nuevo?')) {
                    this.empezarPartida();
                } else {
                    this.terminarPartida();
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});