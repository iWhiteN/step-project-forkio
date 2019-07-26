
;(function () {

    // Mobile Menu
    $(".menu__btn-mobile").on("touchend", e => {
        $(".menu__items").toggleClass('menu__items--mobile-active');
    });

    $(".menu__item").on("touchend", e => {
        $('.menu__item--mobile-active').toggleClass('menu__item--mobile-active');
        $(e.target).toggleClass('menu__item--mobile-active');
        return false
    });

})();
