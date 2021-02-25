function initPage() {

  // Header stick shrink
  let lastScroll = window.pageYOffset;
  const header = document.querySelector('header');
  const nav = header.children[0];
  let scheduledAF = false;
  window.addEventListener('scroll', (e) => {
    const sy = window.pageYOffset;

    if(scheduledAF) return;

    scheduledAF = true;

    requestAnimationFrame(() => {
      if(sy < lastScroll && sy < 20) {
        header.classList.remove('shrinked', 'slide-up', 'slide-down');
        nav.classList.add('navbar-dark');
        nav.classList.remove('navbar-light');
        header.onanimationend = null;
      }
      else if(sy < lastScroll) {
        header.classList.add('shrinked', 'slide-down');
        header.classList.remove('slide-up');
        nav.classList.add('navbar-light');
        nav.classList.remove('navbar-dark');
      } else {
        header.classList.add('slide-up');
        header.classList.remove('slide-down');
        nav.classList.add('navbar-light');
        nav.classList.remove('navbar-dark');
      }
      lastScroll = sy;
      scheduledAF = false;
    });
  }, {passive: true});

  // Footer parallax
  const placeholder = document.getElementById('placeholder')
  const footer = document.querySelector('footer')

  // header
  const headerPlaceholder = document.getElementById('headerPlaceholder');

  // On DOMContentLoaded, set placeholder height to be equal to footer height
  updateHeight()

  window.addEventListener('resize', onResize)

  // On window resize, update placeholder height to be equal to footer height
  function onResize() {
    updateHeight()
  }

  function updateHeight() {
    // Placeholder should always match footer height
    const footerHeight = footer.offsetHeight;
    const headerHeight = header.offsetHeight;

    requestAnimationFrame(() => {
      placeholder.style.height = `${footerHeight}px`
      if(headerPlaceholder) headerPlaceholder.style.height = `${headerHeight}px`;
    })
  }

  // Blog
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach(t => {
    t.addEventListener('transitionrun', (e) => {
      if(e.target.parentNode.firstElementChild.classList.contains('hover-out')) {
        e.target.parentNode.firstElementChild.classList.remove('hover-out');
        return;
      }
      thumbnails.forEach(thumb => {
        const headline = thumb.parentNode.firstElementChild;
        if(headline.classList.contains('hovered')) {
          headline.classList.remove('hovered');
          headline.classList.add('hover-out');
        }
      });
      t.parentNode.firstElementChild.classList.add('hovered');
    })
  });

  //
  // Usecases
  //
  requestAnimationFrame(() => {
    Array.from(document.getElementsByClassName('usecase'))
    // remove first (must always stay first)
      .slice(1)
    // shuffle list
      .sort(() => 0.5 - Math.random())
      .forEach((usecase, index, array) => {
        usecase.parentNode.appendChild(usecase);
      });

    // Add one empty slide after each slider (to balance floating silde number)
    Array.from(document.getElementsByClassName('splide__list'))
    .forEach(splide => {
      const emptyBlock = splide.tagName.toLowerCase() === 'ul' ? document.createElement('li') : document.createElement('div');
      emptyBlock.classList.add('splide__slide');
      splide.appendChild(emptyBlock);

      // Slideshow
      new Splide(splide.parentElement.parentElement, {
        pagination: false,
        perPage: 2.5,
        perMove: 1,
        rewind: false,
        breakpoints: {
          992: {
            perPage: 1.3,
          }
        }
      }).mount();
    });

  });


  // Contact form
  const type = document.querySelectorAll('input[name="type"]');
  const updateFields = (selectedType) => {
    const fields = document.querySelectorAll('[data-selection]');
    fields.forEach((f) => {
      f.style.display = f.getAttribute('data-selection') === selectedType ? 'initial' : 'none';
    });
  }
  if(type.length > 0) updateFields(type.item(0).value);
  type.forEach((t) => t.addEventListener("input", (e) => updateFields(e.target.value)));
}

if(document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
