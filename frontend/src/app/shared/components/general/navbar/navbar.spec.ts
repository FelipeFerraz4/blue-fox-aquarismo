import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing'; // Importante para o ambiente de teste
import { Navbar } from './navbar';

describe('Navbar', () => {
  let spectator: Spectator<Navbar>;

  // O Spectator substitui o TestBed.configureTestingModule
  const createComponent = createComponentFactory({
    component: Navbar,
    imports: [
      RouterTestingModule, // Isso fornece o ActivatedRoute que estava faltando
    ],
    // Se você tiver outros serviços globais no seu blog, coloque aqui
    providers: []
  });

  // Antes de cada teste, criamos o componente de forma limpa
  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should start with menu closed', () => {
    expect(spectator.component.menuOpen).toBe(false);
  });

  it('should toggle menuOpen when toggleMenu is called', () => {
    // No Spectator, você acessa o componente via spectator.component
    spectator.component.toggleMenu();
    expect(spectator.component.menuOpen).toBe(true);

    spectator.component.toggleMenu();
    expect(spectator.component.menuOpen).toBe(false);
  });

  it('should close accordions when menu is toggled to false', () => {
    // Simula estado aberto
    spectator.component.artigosOpen = true;
    spectator.component.menuOpen = true;

    spectator.component.toggleMenu(); // Vai para false

    expect(spectator.component.artigosOpen).toBe(false);
  });

  it('should toggle artigosOpen and close ferramentasOpen', () => {
    // Começa fechado
    expect(spectator.component.artigosOpen).toBe(false);

    spectator.component.toggleArtigos();
    expect(spectator.component.artigosOpen).toBe(true);
    expect(spectator.component.ferramentasOpen).toBe(false);

    // Clica de novo para fechar
    spectator.component.toggleArtigos();
    expect(spectator.component.artigosOpen).toBe(false);
  });

  it('should toggle ferramentasOpen and close artigosOpen', () => {
    // Simula artigos aberto antes
    spectator.component.artigosOpen = true;

    spectator.component.toggleFerramentas();
    expect(spectator.component.ferramentasOpen).toBe(true);
    expect(spectator.component.artigosOpen).toBe(false);

    // Clica de novo para fechar
    spectator.component.toggleFerramentas();
    expect(spectator.component.ferramentasOpen).toBe(false);
  });

  it('should close accordions when menu is toggled to false', () => {
    // Simula estado aberto
    spectator.component.artigosOpen = true;
    spectator.component.ferramentasOpen = true;
    spectator.component.menuOpen = true;

    spectator.component.toggleMenu(); // Vai para false

    expect(spectator.component.artigosOpen).toBe(false);
    expect(spectator.component.ferramentasOpen).toBe(false);
  });

  it('should render navigation links', () => {
    spectator.component.menuOpen = true;
    spectator.component.ferramentasOpen = true;
    spectator.detectChanges();

    expect(spectator.query('a[routerLink="/"]')).toBeTruthy();
    expect(spectator.query('a[href*="about"]')).toBeTruthy();
  });

  it('should toggle menu when button is clicked', () => {
    const button = spectator.query('button.menu-toggle') as HTMLButtonElement;

    expect(spectator.component.menuOpen).toBe(false);

    // Simula clique
    button.click();

    expect(spectator.component.menuOpen).toBe(true);
  });

  it('should toggle artigos when button is clicked', () => {
    const button = spectator.query('button.dropdown-toggle') as HTMLButtonElement;

    expect(spectator.component.artigosOpen).toBe(false);

    button.click();

    expect(spectator.component.artigosOpen).toBe(true);
  });

  it('should toggle ferramentas when button is clicked', () => {
    const button = spectator.queryAll('button.dropdown-toggle')[1] as HTMLButtonElement;

    expect(spectator.component.ferramentasOpen).toBe(false);

    button.click();

    expect(spectator.component.ferramentasOpen).toBe(true);
  });
});