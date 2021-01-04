window.addEventListener("DOMContentLoaded", function() {
	// Slideshow
	new Glider(document.querySelector('.glider'), {
		draggable: true,
		slidesToShow: 2.5,
		slidesToScroll: 1,
		arrows: {
			prev: '.glider-prev',
			next: '.glider-next'
		}
	});

	// Footer parallax
	const placeholder = document.getElementById('placeholder')
	const footer = document.querySelector('footer')

	// On DOMContentLoaded, set placeholder height to be equal to footer height
	updateHeight()

	window.addEventListener('resize', onResize)

	// On window resize, update placeholder height to be equal to footer height
	function onResize() {
		updateHeight()
	}

	function updateHeight() {
		// Placeholder should always match footer height
		placeholder.style.height = `${footer.offsetHeight}px`
	}
})
