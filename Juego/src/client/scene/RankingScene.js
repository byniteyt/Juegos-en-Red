import Phaser from 'phaser';

export class RankingScene extends Phaser.Scene {

    constructor() {
        super('RankingScene');
    }

    preload() {
        this.load.image('ranking', 'Assets/Credits/Fondo_pantallas.png');
    }

    async create(data) {
        this.add.image(600, 350, 'ranking');

        this.add.text(
            600,
            60,
            'Ranking de Jugadores',
            {
                fontSize: '32px',
                color: '#000000'
            }
        ).setOrigin(0.5);

        try {

            const response = await fetch('/api/users');

            if (!response.ok) {
                throw new Error('No se pudieron cargar los usuarios');
            }

            const users = await response.json();

            // Ordenamos por nivel descendente
            users.sort((a, b) => b.level - a.level);

            // Cabeceras
            this.add.text(
                350,
                130,
                'Jugador',
                {
                    fontSize: '28px',
                    fontStyle: 'bold',
                    color: '#e05fdaff'
                }
            );

            this.add.text(
                750,
                130,
                'Nivel',
                {
                    fontSize: '28px',
                    fontStyle: 'bold',
                    color: '#e05fdaff'
                }
            );

            let y = 190;

            users.forEach((user) => {

                this.add.text(
                    350,
                    y,
                    user.name,
                    {
                        fontSize: '24px',
                        color: '#000000'
                    }
                );

                this.add.text(
                    750,
                    y,
                    String(user.level),
                    {
                        fontSize: '24px',
                        color: 'rgb(133, 129, 17)'
                    }
                );

                y += 25;
            });

            const returnButton = this.add.text(113, 640, '  Volver al \n menú inicial', {
            fontFamily: 'MiFuente',
            fontSize: '40px',
            color: '#276d21ff'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => returnButton.setStyle({ fontFamily: 'MiFuente',fill: 'rgba(113, 165, 108, 1)'}))
            .on('pointerout', () => returnButton.setStyle({fontFamily: 'MiFuente', fill: '#276d21ff'}))
            .on('pointerdown', () => this.scene.start('MenuScene',{
                    playerName: data.playerName
                }));

        } catch (error) {

            this.add.text(
                600,
                350,
                error.message,
                {
                    fontSize: '24px',
                    color: '#ff0000'
                }
            ).setOrigin(0.5);
        }
    }
}