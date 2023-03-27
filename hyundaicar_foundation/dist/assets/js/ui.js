tl = TweenMax;

// ---------------------- locomotive scroll, scrolltrigger setting
gsap.registerPlugin(ScrollTrigger);

const elScroll = document.querySelector("[data-scroll-container]");
const elScrollName = "[data-scroll-container]";

const locoScroll = new LocomotiveScroll({
  el: elScroll,
  smooth: true,
  //lerp: 0.4,
  getDirection: true,
  getSpeed: true,
  multiplier: 0.7,
  reloadOnContextChange: true,
  tablet: {
    smooth: true,
    direction: "vertical",
    gestureDirection: "vertical",
    breakpoint: 768,
  },
  smartphone: {
    smooth: true,
    direction: "vertical",
    gestureDirection: "vertical",
  },
});

locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(elScrollName, {
  scrollTop(value) {
    var scTop = locoScroll.scroll.instance.scroll.y;
    //console.log(scTop);
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : scTop;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector(elScrollName).style.transform
    ? "transform"
    : "fixed",
});

ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.defaults({ scroller: elScrollName });

// ---------------------- 첫 로딩될 때
tl.staggerFromTo(
  $("body"),
  0.7,
  { opacity: 0 },
  { opacity: 1, delay: 0.2, ease: Power1.easeOut }
);
tl.staggerFromTo(
  $(".header--logo"),
  0.7,
  { opacity: 0, x: "50px" },
  { opacity: 1, x: "0px", delay: 0.3, ease: Power1.easeInOut }
);
tl.staggerFromTo(
  $(".header--btn"),
  0.7,
  { opacity: 0, x: "-50px" },
  { opacity: 1, x: "0px", delay: 0.3, ease: Power1.easeInOut }
);
tl.staggerFromTo(
  $(".header--nav__item a"),
  1,
  { opacity: 0 },
  { opacity: 1, delay: 0.3, ease: Power1.easeInOut },
  0.1
);

// ---------------------- swiper setting
const findValue = function (target) {
  var swiper = target;
  var delay = swiper.params.autoplay.delay;
  var currentIndex = swiper.realIndex + 1;
  var allSlide = swiper.slides;
  return { swiper, delay, currentIndex, allSlide };
};

const runProgress = function (delay) {
  var progressBar = $(".indicator--line__bar");
  tl.staggerFromTo(
    progressBar,
    delay / 1000,
    { width: 0 },
    {
      width: 100 + "%",
      ease: Power1.easeInOut,
    }
  );
};

const changeSlideNum = function (current) {
  const elCurrentNum = $(".indicator-cur");
  elCurrentNum.text(current < 10 ? "0" + current : current);
};

const settingSlideNum = function (current, all) {
  const elAllNum = $(".indicator-all");

  changeSlideNum(current);
  elAllNum.text(all < 10 ? "0" + all : all);
};

// ---------------------- main 인터렉션
const mainAction = function () {
  tl.staggerFromTo(
    $(".main--text__main  * "),
    0.8,
    { opacity: 0 },
    {
      opacity: 1,
      delay: 0.4,
      ease: Power1.easeInOut,
    },
    0.02
  );
  tl.staggerFromTo(
    $(".main--text__sub  *"),
    0.8,
    { opacity: 0 },
    {
      opacity: 1,
      delay: 0.8,
      ease: Power1.easeInOut,
    },
    0.02
  );
  tl.staggerFromTo(
    $(".main--item__img span"),
    2,
    { scale: "1.3" },
    { scale: "1", ease: Power1.easeInOut }
  );
};

// ---------------------- main slider
var mainSlider = new Swiper(".main--slider", {
  effect: "fade",
  speed: 500,
  loop: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  fadeEffect: {
    crossFade: false,
  },
  mousewheel: false,
  watchSlidesVisibility: true,
  on: {
    init: function () {
      const values = findValue(this);
      settingSlideNum(values.currentIndex, values.allSlide.length);
      runProgress(values.delay);
      mainAction();
      tl.staggerFromTo(
        $(".header"),
        0.8,
        { className: "header" },
        {
          className: "header on",
        },
        0.02
      );
      tl.staggerFromTo(
        $(".indicator"),
        0.8,
        { opacity: 0 },
        {
          opacity: 1,
          delay: 0.8,
          ease: Power1.easeInOut,
        },
        0.02
      );
      tl.staggerFromTo(
        $(".scrolldown"),
        1,
        { opacity: 0 },
        { opacity: 1, delay: 0.4, ease: Power1.easeInOut }
      );
    },
    slideChange: function () {
      const values = findValue(this);
      changeSlideNum(values.currentIndex);
      runProgress(values.delay);
    },
    transitionStart: function () {
      mainAction();
    },
  },
});

// ---------------------- data-scroll-down
$("[data-scroll-down]").click(function () {
  locoScroll.scrollTo(".scholarship", { duration: 100 });
});

// ---------------------- scholarship slide
$(".scholarship--slider").slick({
  speed: 600,
  autoplay: true,
  autoplaySpeed: 3500,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  // focusOnSelect: true,
  variableWidth: true,
  useTransform: false,
  arrows: true,
  pauseOnHover: false,
  pauseOnFocus: false,
  swipe: false,
  touchMove: false,
  draggable: false,
  prevArrow: $(".indicator2--btn__prev"),
  nextArrow: $(".indicator2--btn__next"),
});
const customSlcick = function () {
  if (typeof $.fn.Slick === "undefined") {
    $(".scholarship--slider").find(".b1").addClass("on");
    $(".scholarship--slider__item.on").next().next().addClass("slick-on");

    $(".scholarship--slider").on(
      "beforeChange",
      function (event, slick, currentSlide, nextSlide) {
        $(".scholarship--slider").find('div[class*="b"]').removeClass("on");
        $(".scholarship--slider__item").removeClass("slick-on");
        $(".scholarship--slider")
          .find(
            ".scholarship--slider__item:not(.slick-cloned).b" + (nextSlide + 1)
          )
          .addClass("on");
        $(".scholarship--slider__item.on:not(.slick-cloned)")
          .next()
          .next()
          .addClass("slick-on");
      }
    );
    $(".scholarship--slider").on(
      "afterChange",
      function (event, slick, currentSlide) {
        $(".indicator2--num__cur").text(`0${currentSlide + 1}`);
      }
    );
  }
};

customSlcick();
$(".scholarship--slider").slick("slickPause");

$(".scholarship--slider__item").click(function () {
  const currentOnIndex = Number(
    $(".scholarship--slider__item.slick-on").attr("data-slick-index")
  );
  const currentIndex = Number($(this).attr("data-slick-index"));
  const moveIndex = currentOnIndex - currentIndex;
  const moveDirection = Math.sign(moveIndex) > 0 ? true : false;

  // console.log({ currentIndex, currentOnIndex, moveIndex, moveDirection });
  $(".scholarship--slider").slick(
    "goTo",
    currentIndex + 4 >= 6 ? currentIndex + 4 - 6 : currentIndex + 4
  );

  $(".scholarship--slider").slick("slickPause");
  setTimeout(function () {
    $(".scholarship--slider").slick("slickPlay");
  }, 3000);
});

// locoScroll 해당 영역에 왔을 때 slider 자동 실행
locoScroll.on("call", (func) => {
  if (func == "slick_start") {
    $(".scholarship--slider").slick("slickPlay");
  }
});

const fixedTitle = function (Y_Value, trigger, direction) {
  console.log(
    Math.trunc(Y_Value),
    trigger,
    direction,
    Math.trunc(
      $('[data-js-trigger="ondream"]').offset().top + $(window).height() - 400
    ),
    Math.trunc(
      $('[data-js-trigger="ondream"]').offset().top + $(window).height() / 4
    )
  );
};

const fixTitle = function (scrollY) {
  const fixTitle = $(".ondream--header ");

  // console.log(Math.trunc(scrollY), $(".ondream").height());
  if (Math.trunc(scrollY) < Math.trunc($(".ondream").offset().top) + 200) {
    fixTitle.css("padding-top", "0");
    return false;
  }

  if (Math.trunc($(".ondream").offset().top) < 0) return false;

  console.log(Math.trunc(scrollY), Math.trunc($(".ondream").offset().top));

  fixTitle.css(
    "padding-top",
    `${(Math.trunc(scrollY) - Math.trunc($(".ondream").offset().top)) / 4}px`
  );
};

const changeTab = function (scrollY) {
  const target = $(".ondream--tab__list");
  const target_deco = $(".ondream--deco");
  // console.log(scrollY);

  if (scrollY > 3600) {
    target.removeClass("on");
    target.eq(1).addClass("on");
    target_deco.text("HOPE ON");
  } else {
    target.removeClass("on");
    target.eq(0).addClass("on");
    target_deco.text("FUTURE ON");
  }

  // if (tabBStart || tabBEnd) {
  //   target.removeClass("on");
  //   target.eq(1).addClass("on");
  //   target_deco.text("HOPE ON");
  // } else if (tabAStart || tabArEnd) {
  //   target.removeClass("on");
  //   target.eq(0).addClass("on");
  //   target_deco.text("FUTURE ON");
  // }
};

const changeBgColor = function (area, startTrriger, endTrriger) {
  const target = $(".ondream");

  if (startTrriger || endTrriger) {
    // 바꾸기
    target.css("background", "#002754");
    target.addClass("on");
  } else if (area) {
    target.css("background", "#0f75ed");
    target.removeClass("on");
    // 원위치
  }
};

const fixHeader = function (scrollY, main, direction) {
  const header = $(".header");
  const headerLogo = $(".header--logo img");
  if (main == undefined) return false;
  if (scrollY > main.target.clientHeight / 2 + 110) {
    header.addClass("fixed");
    headerLogo.attr("src", "../img/btype/logo_c.svg");
  } else {
    header.removeClass("fixed");
    headerLogo.attr("src", "../img/btype/logo.svg");
  }
};

locoScroll.on("scroll", (obj) => {
  const { delta, scroll, limit, currentElements, direction } = obj;
  changeBgColor(
    currentElements.ondream,
    currentElements.ondream_content3,
    currentElements.ondream_content5
  );
  changeTab(scroll.y);
  // fixTitle(scroll.y);
  fixHeader(scroll.y, currentElements.main, direction);

  // console.log(delta, scroll, limit, currentElements, direction);
});

const modalOpen = function () {
  locoScroll.stop();
  $("body").addClass("modal-open");
  $(".modal").fadeIn(500);
  $(".modal--box").css({
    transform: "translate(-50%, -50%)",
    opacity: "1",
  });
};
const modalClose = function () {
  locoScroll.start();
  $("body").removeClass("modal-open");
  $(".modal").fadeOut(500);
  $(".modal--box").css({
    transform: "translate(-50%, -80%)",
    opacity: "0",
  });
};

// $(window).resize(function () {
//   locoScroll.init();
// });
