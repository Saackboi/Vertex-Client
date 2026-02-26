import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <div class="footer-shell">
        <div class="footer-top">
          <div class="brand-block">
            <div class="brand-title">VERTEX</div>
            <p class="brand-text">
              Impulsa tu perfil profesional con herramientas inteligentes y un flujo sin fricciones.
            </p>
          </div>

          <div class="link-block">
            <p class="link-title">Producto</p>
            <a class="footer-link" href="/">Inicio</a>
            <a class="footer-link" href="/onboarding">Onboarding</a>
            <a class="footer-link" href="/notifications">Notificaciones</a>
          </div>

          <div class="link-block">
            <p class="link-title">Recursos</p>
            <a class="footer-link" href="/">Documentacion</a>
            <a class="footer-link" href="/">Soporte</a>
            <a class="footer-link" href="/">Preguntas frecuentes</a>
          </div>

          <div class="link-block">
            <p class="link-title">Legal</p>
            <a class="footer-link" href="/">Privacidad</a>
            <a class="footer-link" href="/">Terminos</a>
            <a class="footer-link" href="/">Contacto</a>
          </div>
        </div>

        <div class="footer-bottom">
          <span class="legal">© 2026 VERTEX. Todos los derechos reservados.</span>
          <div class="socials">
            <a class="social-link" href="/" aria-label="LinkedIn">LinkedIn</a>
            <a class="social-link" href="/" aria-label="GitHub">GitHub</a>
            <a class="social-link" href="/" aria-label="Email">Email</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrls: []
})
export class AppFooterComponent {}
