# KAlarm — biblioteca SoftCare ilustrada (v6)

Este checkpoint integra **30 ícones PNG** originais em seis famílias, a identidade do aplicativo, o foreground adaptativo Android, a silhueta monocromática e o splash. Cada ícone da cartela foi recortado, centrado e exportado separadamente em 256×256 com transparência.

## Arquivos
- `assets/softcare/icons/*.png`: 30 ícones individuais para as telas.
- `assets/softcare/manifest.json`: catálogo com família, posição na cartela e hash SHA-256.
- `assets/icon.png`: launcher 1024×1024.
- `assets/play-store-512.png`: arte 512×512 para Play Console, sujeita à revisão.
- `assets/adaptive-icon.png`: foreground transparente para Android.
- `assets/adaptive-icon-monochrome.png`: ícone monocromático para temas do sistema.
- `assets/brandmark.png`: marca transparente para uso na interface/README.
- `assets/splash.png`: imagem inicial com a marca.

## Uso no React Native
```tsx
import { SoftCareIcon } from './src/components/icons/SoftCareIcon';
<SoftCareIcon name="alarm" size={48} label="Alarme" />
```

O componente escolhe PNGs individuais por referência estática `require()` compatível com Metro. Mantém os SVGs geométricos antigos como fallback para utilitários ainda sem uma ilustração correspondente. A galeria em `/icon-gallery` permite conferir os 30 ícones no dispositivo.

## Atenção
As cartelas foram geradas por IA e os recortes são PNGs rasterizados, **não SVGs vetoriais editáveis**. Nunca renomear PNG para `.svg`. Usar 32–76 dp em telas normais e conferir leitura em 24 dp na navegação. Testar a máscara do ícone adaptativo em dispositivos e finalizar variações antes da publicação.

O projeto segue sendo a **primeira versão de demonstração**, sem cadastro funcional de medicamentos e sem confirmação de entrega real de alarmes.
