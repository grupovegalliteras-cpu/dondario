<?php
/**
 * Plugin Name: Multiservicios Mallorca · Capa visual
 * Description: Hero con vídeo, animaciones y refinamiento visual. Solo presentación: no toca textos, enlaces, formularios ni SEO. Para desactivarlo basta con borrar este archivo.
 * Version: 1.0.0
 * Author: NEXO
 *
 * Instalación: copiar este archivo en /wp-content/mu-plugins/ y la carpeta "mm-visual"
 * (contenido de /dist) en /wp-content/uploads/mm-visual/.
 */

defined( 'ABSPATH' ) || exit;

define( 'MM_VISUAL_VERSION', '1.0.0' );
define( 'MM_VISUAL_URL', content_url( '/uploads/mm-visual/' ) );

/**
 * Preloads: fuentes corporativas (todas las páginas) y póster del hero (solo portada).
 * Prioridad 1 para que salgan lo antes posible en el <head>.
 */
add_action( 'wp_head', function () {
	$fonts = content_url( '/uploads/generatepress/fonts/' );
	printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( $fonts . 'albert-sans/i7dOIFdwYjGaAMFtZd_QA1ZbYFc.woff2' ) );
	printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( $fonts . 'outfit/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4S-EiAou6Y.woff2' ) );

	if ( is_front_page() ) {
		printf( '<link rel="preload" href="%s" as="image" media="(min-width: 768px)" fetchpriority="high">' . "\n", esc_url( MM_VISUAL_URL . 'media/mm-hero-poster.webp' ) );
		printf( '<link rel="preload" href="%s" as="image" media="(max-width: 767px)" fetchpriority="high">' . "\n", esc_url( MM_VISUAL_URL . 'media/mm-hero-poster-mobile.webp' ) );
	}
}, 1 );

/**
 * CSS y JS de la capa visual. Prioridad alta para cargar después de GeneratePress / GenerateBlocks.
 */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'mm-visual', MM_VISUAL_URL . 'mm-visual.css', array(), MM_VISUAL_VERSION );

	wp_enqueue_script( 'mm-visual', MM_VISUAL_URL . 'mm-visual.js', array(), MM_VISUAL_VERSION, array(
		'in_footer' => true,
		'strategy'  => 'defer',
	) );
	wp_add_inline_script( 'mm-visual', 'window.mmVisual={media:' . wp_json_encode( MM_VISUAL_URL . 'media/' ) . '};', 'before' );

	/*
	 * OPCIONAL — solo con aprobación del cliente (arregla el acordeón "Zonas donde trabajamos"
	 * y los botones "Abrir", hoy sin funcionar). Descomentar para activarlo:
	 *
	 * wp_enqueue_script( 'mm-fix-zonas', MM_VISUAL_URL . 'opcional/mm-fix-zonas.js', array(), MM_VISUAL_VERSION, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	 */
}, 999 );
