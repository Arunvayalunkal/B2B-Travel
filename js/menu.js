$(function () {
  const $items = $('.portal-item');
  const closeAll = () => {
    $('.portal-dropdown').removeClass('show');
    $('.portal-trigger').removeClass('is-open').attr('aria-expanded', 'false');
    $('.has-submenu').removeClass('sub-open');
  };

  $('.portal-trigger').on('click', function (e) {
    e.preventDefault();
    const $trigger = $(this);
    const $item = $trigger.closest('.portal-item');
    const $panel = $item.children('.portal-dropdown');
    const wasOpen = $panel.hasClass('show');
    closeAll();
    if (!wasOpen) {
      $panel.addClass('show');
      $trigger.addClass('is-open').attr('aria-expanded', 'true');
    }
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.portal-item, .portal-drawer').length) closeAll();
  });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  $('.submenu-trigger').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const $parent = $(this).closest('.has-submenu');
    $parent.toggleClass('sub-open');
    $parent.siblings('.has-submenu').removeClass('sub-open');
  });

  $('.mega-category').on('click', function () {
    const category = $(this).data('category');
    $('.mega-category').removeClass('active');
    $(this).addClass('active');
    $('.mega-section').removeClass('active');
    $('.mega-section[data-section="' + category + '"]').addClass('active');
    $('#manageSearch').val('').trigger('input');
  });

  $('#manageSearch').on('input', function () {
    const query = $(this).val().toLowerCase().trim();
    if (!query) {
      $('.mega-category, .mega-group').show();
      return;
    }
    $('.mega-section').each(function () {
      const $section = $(this);
      let visibleGroups = 0;
      $section.find('.mega-group').each(function () {
        const match = $(this).text().toLowerCase().includes(query);
        $(this).toggle(match);
        if (match) visibleGroups++;
      });
      $section.toggleClass('active', visibleGroups > 0);
    });
    $('.mega-category').each(function () {
      const key = $(this).data('category');
      const found = $('.mega-section[data-section="' + key + '"] .mega-group:visible').length > 0;
      $(this).toggle(found);
    });
    const $first = $('.mega-section.active').first();
    if ($first.length) {
      $('.mega-category').removeClass('active');
      $('.mega-category[data-category="' + $first.data('section') + '"]').addClass('active');
    }
  });

  // On mobile, a nested submenu expands inline. On desktop it opens beside its parent.
  function setSubmenuMode() {
    if (window.matchMedia('(max-width: 991.98px)').matches) {
      $('.nested-menu').css({left: '', top: ''});
    }
  }
  setSubmenuMode();
  $(window).on('resize', setSubmenuMode);

  // ===== Mobile off-canvas drawer =====
  const isMobile = () => window.matchMedia('(max-width: 991.98px)').matches;
  const $toggle = $('.mobile-menu-toggle');
  const openDrawer = () => {
    $('body').addClass('nav-open');
    $toggle.attr('aria-expanded', 'true');
  };
  const closeDrawer = () => {
    $('body').removeClass('nav-open');
    $toggle.attr('aria-expanded', 'false');
    closeAll();
  };

  $toggle.on('click', function (e) {
    e.stopPropagation();
    $('body').hasClass('nav-open') ? closeDrawer() : openDrawer();
  });
  $('.drawer-close, .menu-backdrop').on('click', closeDrawer);
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
  // Leaving mobile width resets the drawer state
  $(window).on('resize', function () { if (!isMobile()) closeDrawer(); });

  // Close the drawer after a destination link is selected.
  $('.portal-dropdown a').on('click', function () {
    if (isMobile()) closeDrawer();
  });
});
