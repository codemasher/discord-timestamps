<?php
/**
 * build.php
 *
 * @created      25.09.2024
 * @author       smiley <smiley@chillerlan.net>
 * @copyright    2024 smiley
 * @license      MIT
 */
declare(strict_types=1);

const SRCDIR   = __DIR__.'/../src';
const BUILDDIR = __DIR__.'/../.build';

if(!is_dir(BUILDDIR)){
	mkdir(BUILDDIR);
}

$index  = file_get_contents(SRCDIR.'/index.html');
$style  = file_get_contents(SRCDIR.'/style.css');
$script = file_get_contents(SRCDIR.'/script.js');

// indent the stylesheet properly
$style = array_map(function($l){
	$l = rtrim($l);

	if($l === ''){
		return '';
	}

	return "\t\t".$l;
}, explode("\n", trim($style)));

// put the stylesheet in inline tags
$index = str_replace('<link rel="stylesheet" href="style.css">', sprintf("<style>\n%s\n\t</style>", implode("\n", $style)), $index);

$index = str_replace('<script src="script.js"></script>', sprintf("<script>\n%s\n</script>", trim($script)), $index);

// remove leftover CR and save
file_put_contents(BUILDDIR.'/index.html', str_replace("\r", '', $index));
