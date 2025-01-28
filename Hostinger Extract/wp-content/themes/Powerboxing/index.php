<?php get_header(); ?>

<section class="hero">
    <img src="<?php echo get_template_directory_uri(); ?>/images/logo.png" alt="Power Boxing Logo">
    <h1><?php bloginfo('name'); ?></h1>
    <button>Join Now</button>
</section>

<section class="features">
    <div class="card">
        <img src="<?php echo get_template_directory_uri(); ?>/images/boxing_rounds.png" alt="Boxing Rounds">
        <h2>Boxing Rounds</h2>
        <p>Precision and power with guided boxing rounds.</p>
    </div>
    <div class="card">
        <img src="<?php echo get_template_directory_uri(); ?>/images/functional_training.png" alt="Functional Training">
        <h2>Functional Training</h2>
        <p>Agility and strength with kettlebell circuits.</p>
    </div>
    <div class="card">
        <img src="<?php echo get_template_directory_uri(); ?>/images/iot_punch_bags.png" alt="IoT Punch Bags">
        <h2>IoT Punch Bags</h2>
        <p>Smart tools to track your performance.</p>
    </div>
</section>

<section class="video-section">
    <h2>Watch Our Training Video</h2>
    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
</section>

<?php get_footer(); ?>
