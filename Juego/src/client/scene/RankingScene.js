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
        this.activeuser = data.player;
        this.add.text(
            600,
            60,
            'Ranking de Jugadores',
            {
                fontFamily: 'MiFuente',
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
                750,
                140,
                'Jugador',
                {
                    fontFamily: 'MiFuente',fontSize: '28px',
                    fontStyle: 'bold',
                    color: '#e05fdaff'
                }
            );

            this.add.text(
                950,
                140,
                'Victorias',
                {
                    fontFamily: 'MiFuente',
                    fontSize: '28px',
                    fontStyle: 'bold',
                    color: '#e05fdaff'
                }
            );

            let y = 190;

            users.forEach((user) => {

                this.add.text(
                    750,
                    y,
                    user.name,
                    {
                        fontFamily: 'MiFuente',
                        fontSize: '24px',
                        color: '#000000'
                    }
                );

                this.add.text(
                    950,
                    y,
                    String(user.level),
                    {
                        fontFamily: 'MiFuente',
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
                    player: this.activeuser
                }));

        } catch (error) {

        this.add.text(
            600,
            350,
            error.message,
            {
                fontFamily: 'MiFuente',
                fontSize: '24px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);
        }

        const activePlayerText = this.add.text(
            150,
            230,
            `Usuario activo: ${this.activeuser.name}`,
            {
                fontFamily: 'MiFuente',
                fontSize: '24px',
                color: '#0e1e67'
            }
        ).setOrigin(0.5);
        //////////  CAMBIAR USUARIO ///////////

        const changeUser = this.add.text(150, 290, 'Cambiar usuario', {
            fontFamily: 'MiFuente',
            fontSize: '24px',
            color: '#000'
        }).setOrigin(0.5);

        // Usuario actual
        const UserInput = this.add.dom(150, 340, 'input', {
            width: '180px',
            height: '30px'
        });

        UserInput.node.placeholder = 'Usuario';

        // Nuevo usuario
        const UserPasswordInput = this.add.dom(150, 390, 'input', {
            width: '180px',
            height: '30px'
        });

        UserPasswordInput.node.placeholder = 'Contraseña';

        // Botón
        const updateButton = this.add.text(150, 440, 'Cambiar', {
            fontFamily: 'MiFuente',
            fontSize: '22px',
            backgroundColor: '#0066cc',
            color: '#ffffff',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5)
        .setInteractive();

        updateButton.on('pointerdown', async () => {

            const user = UserInput.node.value;
            const password = UserPasswordInput.node.value;

            try {
                const changed = await fetch(`/api/users/${user}`,{
                                method: 'GET'});

                const data = await changed.json();

                if (!changed.ok) {
                    throw new Error(data.error || 'Error obteniendo usuario');
                }
                if(data.password != password){
                    throw new Error('La contraseña no es correcta');
                }
                activePlayerText.text = `Usuario activo: ${data.name}`;
                this.activeuser = data;

            } catch (err) {
                console.error(err);
            }

        });
        ////////// ELIMINAR USUARIO ///////////        
        
        const deleteUser = this.add.text(350, 290, 'Eliminar usuario', {
            fontFamily: 'MiFuente',
            fontSize: '24px',
            color: '#000'
        }).setOrigin(0.5);

        // Input para la contraseña
        const deleteInput = this.add.dom(350, 370, 'input', {
            width: '180px',
            height: '30px'
        });

        const deleteButton = this.add.text(350, 440, 'Eliminar', {
            fontFamily: 'MiFuente',
            fontSize: '22px',
            backgroundColor: '#cc0000',
            color: '#ffffff',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5)
        .setInteractive();

        deleteButton.on('pointerdown', async () => {

            const password = deleteInput.node.value;

            try {

                const response = await fetch(`/api/users/${data.player.id}`, {
                    method: 'DELETE'
                });
                if(response.ok){
                    this.scene.start('RankingScene', {
                        player: this.activeuser
                    });
                }
                
                deleteUser.text = 'Error al eliminar usuario';
            } catch (err) {
                console.error(err);
            }

        });
    }
}