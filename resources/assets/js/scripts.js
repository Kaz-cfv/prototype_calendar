//=include _pages/global.js
//=include _modules/calendar.js

(() => {

})();

//DOMContentLoaded
$(() => {
});

//images resources loaded
$(window).on('load', () => {

  const calendar = new Calender();

  $(window).trigger('loading');
});

//after loading animation
$(window).on('loading', () => {

});

// スマホ・タブレットの向き判定
// $(window).on('orientationchange', ()=>{
//   if(isPortrait()){
//     console.log('isPortrait');
//   } else {
//     console.log('isLandscape');
//   }
// });
