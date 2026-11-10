import { Component, signal } from '@angular/core';

interface Collection {
  readonly title: string;
  readonly category: string;
  readonly image: string;
  readonly alt: string;
  readonly tall: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly menuOpen = signal(false);

  protected readonly collections: readonly Collection[] = [
    {
      title: 'Living',
      category: 'Viver e receber',
      image: 'images/hero.jpg',
      alt: 'Sala contemporânea com sofá de couro, poltronas e luz natural',
      tall: true,
    },
    {
      title: 'Arquitetura',
      category: 'Linhas e matéria',
      image: 'images/architecture.jpg',
      alt: 'Casa contemporânea com madeira natural, vidro e jardim',
      tall: false,
    },
    {
      title: 'Estar',
      category: 'Conforto essencial',
      image: 'images/living-room.jpg',
      alt: 'Sala integrada com sofá claro, mesa baixa e parede em madeira',
      tall: true,
    },
    {
      title: 'Dormitório',
      category: 'Um lugar para desacelerar',
      image: 'images/bedroom.jpg',
      alt: 'Quarto claro com cama em tons naturais e janela ampla',
      tall: true,
    },
    {
      title: 'Integração',
      category: 'Espaço para compartilhar',
      image: 'images/lounge.jpg',
      alt: 'Ambiente social contemporâneo com sala e cozinha integradas',
      tall: false,
    },
    {
      title: 'Detalhes',
      category: 'A beleza do cotidiano',
      image: 'images/armchair.jpg',
      alt: 'Poltronas em madeira e couro em uma sala acolhedora',
      tall: true,
    },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
