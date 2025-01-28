<?php


/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u725383736_RwTcW' );

/** Database username */
define( 'DB_USER', 'u725383736_ZfTWM' );

/** Database password */
define( 'DB_PASSWORD', '248Lki55v5' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'KGx2Kwonb)w<VgUei= ZnfYYOu26V3jhQIb)Ayy(8PMpAx.1Mo`9<l.zIS_|g>os' );
define( 'SECURE_AUTH_KEY',   '//.ZZ):x5pHjjs~P{!)&]X}qHqV9[7#&zRfWx>}[Vd^V*XI.$qQ(YmmC:iQiVF94' );
define( 'LOGGED_IN_KEY',     'le9)9x]XejJAJN0w0Y;HgJV#,KNBF0ame@%}.=&.gZwSsJ&nDm}L`P,|PT@wJ;s6' );
define( 'NONCE_KEY',         'onnNjru$Zdb,Q=mB)%O;1Bpha^K~0,P=n]1y]oT/p UDt3u^N8sP<7H[b#o(k`@:' );
define( 'AUTH_SALT',         'n6fg}vXom01,GBBJQ={`rB[B_F(oWy/_Ry?!ZOmXhf(d R9#{&5hP+ZB/&_y&SlE' );
define( 'SECURE_AUTH_SALT',  '3xX8LW1*1;[ 1nP}9AMoVI~7*_Hg4Qm$!FO]Q?vVs-zgYxn1K=p487iaHp/v7L~0' );
define( 'LOGGED_IN_SALT',    'gVkp>AjIikW{wRWev[=iZCcY!!faPnkPTqd@LhCOw(t8y<@gq4Rw&10Js5KK(S.q' );
define( 'NONCE_SALT',        '*OASHJZ:3X;>-!)}KZVkY6~rPbM~|O7c55A3i[Lwo:1]!hLS.hCJ8=7(PG!y|q[>' );
define( 'WP_CACHE_KEY_SALT', '?m-`*YDof/I[IK?+lQQeB>A[bJ5I0CsDEc-*w_yDE3fH@qoX.,_bur3|b<YsPLvy' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', 'da6de309ccfa2a2c3f3bc35ae1a14290' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
