import Phaser from 'phaser';

export class RankingScene extends Phaser.Scene {

    constructor() {
        super('RankingScene');
    }

    async create(data) {
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
                    color: '#ffff00'
                }
            );

            this.add.text(
                750,
                130,
                'Nivel',
                {
                    fontSize: '28px',
                    fontStyle: 'bold',
                    color: '#ffff00'
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

            const returnButton = this.add.text(100, 625, 'Return', {
            fontSize: '24px',
            color: '#d0f12b',
            backgroundColor: '#1e94d8'
            })
            .setDepth(1)
            .setOrigin(0.5)
            .setScale(1)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () =>{
                this.scene.start('MenuScene',{
                    playerName: data.playerName
                });
            });

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