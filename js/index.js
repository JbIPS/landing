function initPage() {
  // Header stick shrink
  let lastScroll = window.pageYOffset;
  const header = document.querySelector('header');
  const shareBox = document.getElementById('shareBox');
  const nav = header.children[0];
  let scheduledAF = false;
  window.addEventListener('scroll', (e) => {
    const sy = window.pageYOffset;

    if(scheduledAF) return;

    scheduledAF = true;

    requestAnimationFrame(() => {
      // Appearing Share box
      if(shareBox && sy > 700 && sy < 1800) {
        shareBox.classList.add('opacity-100');
      } else if(shareBox) {
        shareBox.classList.remove('opacity-100');
      }

      // Shrinking header
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
      emptyBlock.classList.add('splide__slide', 'd-none', 'd-lg-block');
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

  // Scrollspy
  const spies = document.querySelectorAll('[data-bs-spy]');
  spies.forEach(spy => {
    const target = document.querySelector(spy.getAttribute('data-bs-target'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;

        for(let i = 0; i < target.children.length; i++) {
          const child = target.children[i];
          if(child.classList.contains('active')) {
            child.classList.remove('active');
          } else if(child.getAttribute('href').substr(1) === entry.target.id) {
            child.classList.add('active');
          }
        }
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: .5
    });
    for(let i = 0; i < target.children.length; i++) {
      observer.observe(document.getElementById(target.children[i].getAttribute('href').substr(1)));
    }
  });

  // Story scroll
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;

      document.querySelector(".story li.step.active").classList.remove("active");
      entry.target.classList.add("active");
    });
  }, {
      root: null,
      rootMargin: '0px',
      threshold: .5
    });
  document.querySelectorAll(".story li.step").forEach(step => {
    obs.observe(step);
  });

  // Blog post list
  const postsList = document.querySelector('.posts-list');
  if(postsList) {
    const grid = new Isotope(postsList, {
      itemSelector: '.post',
      layout: 'masonry',
      masonry: {
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer'
      },
     percentPosition: true
    })
    window.filterPosts = function(category) {
      grid.arrange({
        filter: function(elem) {
          return !!! category || elem.getAttribute('data-groups').includes(category)
        }
      });
    }
  }
}

if(document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

function hideVideo(video, button) {
  video.removeAttribute('style');
  button.removeAttribute('style');
}

let listenerSet = false;
function playPause(element) {
  const playButton = document.querySelector('.play-button');
  if(element.paused) {
    playButton.style.display = 'none';
    element.style.opacity = 1;

    // Fullscreen on mobile
    if(window.innerWidth < 992) {
      try {
      if(element.webkitEnterFullscreen)
        element.webkitEnterFullscreen();
      else if (element.requestFullscreen)
        element.requestFullscreen();
      else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
      else if (element.msRequestFullScreen)
        element.msRequestFullScreen();
      } catch(e) {

      }
    }

    element.play()
    .then(() => {
    })
    .catch((e) => {
      console.error(e);
    });
    if(!listenerSet) {
      element.addEventListener('ended', () => {
        // Reset video
        element.load();
        hideVideo(element, playButton);
      });
      listenerSet = true;
    }
  } else {
    hideVideo(element, playButton);
    element.pause();

    if(window.innerWidth < 992) {
      if (document.exitFullscreen)
        document.exitFullscreen();
      else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
      else if (document.msExitFullscreen)
        document.msExitFullscreen();
    }
  }
}
